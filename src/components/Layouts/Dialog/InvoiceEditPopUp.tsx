"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui-elements/button";
import { CheckIcon } from "@/assets/icons";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PdfViewPopUp from "./PdfViewPopUp";
import InputGroup from "@/components/FormElements/InputGroup";
import ChequeEditMuiDataGrid from "@/components/Tables/DataGrid/ChequeEditMuiDataGrid";
import { TextAreaOne } from "@/components/FormElements/InputGroup/TextAreaOne";
import { InvoiceCheques, InvoiceData } from "@/types/ObjectTypes/InvoiceType";
import { CombinedService } from "@/app/api/invoice";
import MuiDatePicker from "@/components/FormElements/DatePicker/MuiDatePicker";
import AutoCompleteWithSelectorButton from "@/components/FormElements/AutoCompletes/AutoCompleteWithSelectorButton";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useAuthenticatedRequest } from "@/lib/auth";
import { usePostClientContent } from "@/utils/post-client-content";
import { useAlert } from "@/utils/AlertProvider";

// TypeScript Interfaces
interface Post {
  postId: number;
  postcode: string;
  buildingAddress: string;
  streetAddress: string;
  isEnded: boolean;
  client: {
    clientId: number;
    clientName: string;
    fullName: string | null;
    address: string | null;
    createDate: string;
    updateDate: string;
  };
  createDate: string;
  updateDate: string;
}

interface InvoiceEditPopUpPropsType {
  title: string;
  open: boolean;
  onClose: (open: boolean) => void;
  invoiceInfo: InvoiceData;
  postArray: Post[];
}

interface FormData {
  invoiceNum: string;
  postcode: string;
  amount: number;
  clientName: string;
  fullName: string;
  buildingAddress: string;
  streetAddress: string;
  address: string;
  invoiceDate: any;
}

function InvoiceEditPopUp({
  title,
  open,
  onClose,
  invoiceInfo,
  postArray,
}: InvoiceEditPopUpPropsType) {
  const [formData, setFormData] = useState<FormData>({
    invoiceNum: "",
    postcode: "",
    amount: 0,
    clientName: "",
    fullName: "",
    buildingAddress: "",
    streetAddress: "",
    address: "",
    invoiceDate: dayjs(new Date()),
  });
  const [pdfSrc, setPdfSrc] = useState<string>("");
  const [invoiceCheques, setInvoiceCheques] = useState<InvoiceCheques[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [pdfViewPopUp, setPdfViewPopUp] = useState<boolean>(false);
  const [loadingInvoiceCheques, setLoadingInvoiceCheques] =
    useState<boolean>(false);
  const [loadingCheques, setLoadingCheques] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [dataGridLoaded, setDataGridLoaded] = useState<boolean>(false);
  const [postSelectArray, setPostSelectArray] = useState<
    { key: string; name: string }[]
  >([]);
  const [error, setError] = useState<string>("");

  const { makeAuthenticatedRequest } = useAuthenticatedRequest();
  const { setInvoiceData } = usePostClientContent();
  const { addAlert } = useAlert();

  // Validate invoiceInfo
  const isValidInvoiceInfo = (info: InvoiceData): boolean => {
    return !!(
      info &&
      info.post &&
      info.post.client &&
      info.invoiceNum &&
      info.post.postcode &&
      // info.post.postcode.trim() !== "" &&
      info.amount !== undefined &&
      info.invoiceDate &&
      info.post.client.clientId
    );
  };

  const isValidFormData = (data:FormData) : boolean => {
    return !!(
      data &&
      data.invoiceNum &&
      data.amount &&
      data.invoiceDate &&
      data.postcode &&
      data.postcode.trim() !== "" &&
      postArray.some((post) => post.postcode === data.postcode)
    );
  };

  // Utility to handle null values
  const toEmptyIfNull = (value: string | null): string => {
    return value === null ? "" : value;
  };

  // Initialize form with invoiceInfo
  useEffect(() => {
    if (!isValidInvoiceInfo(invoiceInfo)) {
      console.warn("Invalid or incomplete invoiceInfo:", invoiceInfo);
      return;
    }

    console.log("Initializing form with invoiceInfo");
    setFormData({
      invoiceNum: invoiceInfo.invoiceNum,
      postcode: invoiceInfo.post.postcode,
      amount: invoiceInfo.amount,
      clientName: invoiceInfo.post.client.clientName,
      fullName: toEmptyIfNull(invoiceInfo.post.client.fullName),
      address: toEmptyIfNull(invoiceInfo.post.client.address),
      buildingAddress: invoiceInfo.post.buildingAddress,
      streetAddress: invoiceInfo.post.streetAddress,
      invoiceDate: dayjs(invoiceInfo.invoiceDate),
    });

    setLoadingInvoiceCheques(true);
    CombinedService.get_invoice_cheque_by_invoice_id(
      invoiceInfo.invoiceId,
      makeAuthenticatedRequest,
    )
      .then((res) => {
        if (!Array.isArray(res) || res.length === 0) {
          console.log("No invoice cheques found for this invoice.");
          setInvoiceCheques([]);
          return;
        }

        const invoiceChequesList = res
          .map((item: any) => {
            if (
              !item ||
              typeof item[0] === "undefined" ||
              typeof item[5] === "undefined"
            ) {
              console.warn("Invalid cheque data:", item);
              return null;
            }
            return {
              invoice: {
                invoiceId: item[0],
                invoiceNum: undefined,
                post: undefined,
                invoiceDate: undefined,
                amount: undefined,
                paidAmount: undefined,
                isPaid: undefined,
                isPending: undefined,
                settlementDate: undefined,
                statementId: undefined,
                invoiceChequesList: [],
                createDate: undefined,
                updateDate: undefined,
              },
              cheque: {
                chequeId: item[5],
                base64StringChequeCopy: undefined,
                invoiceChequesList: [],
              },
              amount: item[1],
              paymentDate: item[3],
            };
          })
          .filter((item): any => item !== null);

        setInvoiceCheques((prev: any) =>
          JSON.stringify(prev) !== JSON.stringify(invoiceChequesList)
            ? invoiceChequesList
            : prev,
        );
      })
      .catch((err) => {
        console.error("Error fetching invoice cheques:", err);
        addAlert(String(err), 'error', 10000);
        setInvoiceCheques([]);
      })
      .finally(() => {
        setLoadingInvoiceCheques(false);
      });
  }, [invoiceInfo.invoiceId, open]); // Use specific property

  // Filter posts based on clientId
  useEffect(() => {
    if (
      !isValidInvoiceInfo(invoiceInfo) ||
      !Array.isArray(postArray) ||
      postArray.length === 0
    ) {
      console.warn("Invalid postArray or invoiceInfo:", {
        postArray,
        invoiceInfo,
      });
      setFilteredPosts([]);
      setPostSelectArray([]);
      return;
    }

    console.log("Filtering posts");
    const newFilteredPosts = postArray.filter(
      (post) => post.client?.clientId === invoiceInfo.post.client.clientId,
    );
    setFilteredPosts((prev) =>
      JSON.stringify(prev) !== JSON.stringify(newFilteredPosts)
        ? newFilteredPosts
        : prev,
    );
    setPostSelectArray((prev) => {
      const postcodeArr = newFilteredPosts.map((item) => ({
        key: item.postId.toString(),
        name: item.postcode,
      }));
      return JSON.stringify(prev) !== JSON.stringify(postcodeArr)
        ? postcodeArr
        : prev;
    });
  }, [invoiceInfo.post?.client?.clientId, postArray]); // Use specific property

  // Update addresses based on postcode
  useEffect(() => {
    console.log("Updating addresses for postcode:", formData.postcode);
    const matchingPost = filteredPosts.find(
      (item) => item.postcode === formData.postcode,
    );
    if (matchingPost) {
      setFormData((prev) =>
        prev.buildingAddress !== matchingPost.buildingAddress ||
        prev.streetAddress !== matchingPost.streetAddress
          ? {
              ...prev,
              buildingAddress: matchingPost.buildingAddress,
              streetAddress: matchingPost.streetAddress,
            }
          : prev,
      );
    } else {
      setFormData((prev) =>
        prev.buildingAddress !== "" || prev.streetAddress !== ""
          ? { ...prev, buildingAddress: "", streetAddress: "" }
          : prev,
      );
    }
  }, [formData.postcode, filteredPosts]);

  // Update cheque copy and persist to server
  const setChequeCopy = async (chequeId: number, newChequeCopy: string) => {
    setInvoiceCheques((prev) => {
      const isUnchanged = prev.some(
        (invoiceCheque) =>
          invoiceCheque.cheque.chequeId === chequeId &&
          invoiceCheque.cheque.base64StringChequeCopy === newChequeCopy,
      );
      if (isUnchanged) return prev;
      return prev.map((invoiceCheque) =>
        invoiceCheque.cheque.chequeId === chequeId
          ? {
              ...invoiceCheque,
              cheque: {
                ...invoiceCheque.cheque,
                base64StringChequeCopy: newChequeCopy,
              },
            }
          : invoiceCheque,
      );
    });
  };

  // Clear form data
  const clearData = () => {
    setFormData({
      invoiceNum: "",
      postcode: "",
      amount: 0,
      clientName: "",
      fullName: "",
      buildingAddress: "",
      streetAddress: "",
      address: "",
      invoiceDate: dayjs(new Date()),
    });
    setPdfSrc("");
    setError("");
    setInvoiceCheques([]);
    setFilteredPosts([]);
    setPostSelectArray([]);
  };

  // Close dialog
  const closePopUp = () => {
    clearData();
    onClose(false);
  };

  // Close PDF viewer and clear pdfSrc
  const closePdfViewPopUp = () => {
    setPdfViewPopUp(false);
    setPdfSrc("");
  };

  // Submit form data
  const submit = async () => {
    setIsSubmitting(true);
    if (!isValidFormData(formData)) {
      console.error("Invalid invoice data for submission");
      setError("Invalid data entered");
      setIsSubmitting(false);
      return;
    }

    const newDate = new Date();
    const invoice: InvoiceData = {
      invoiceId: invoiceInfo.invoiceId,
      invoiceNum: invoiceInfo.invoiceNum,
      post: {
        postId: invoiceInfo.post.postId,
        postcode: formData.postcode,
        buildingAddress: formData.buildingAddress,
        streetAddress: formData.streetAddress,
        isEnded: invoiceInfo.post.isEnded,
        client: {
          clientId: invoiceInfo.post.client.clientId,
          clientName: invoiceInfo.post.client.clientName,
          fullName: formData.fullName,
          address: formData.address,
          createDate: invoiceInfo.post.client.createDate,
          updateDate: newDate.toISOString(),
        },
        createDate: invoiceInfo.post.createDate,
        updateDate: newDate.toISOString(),
      },
      invoiceChequesList: invoiceCheques,
      invoiceDate: formData.invoiceDate?.toDate().toISOString(),
      isPaid: invoiceInfo.isPaid,
      isPending: false,
      amount: formData.amount,
      paidAmount: invoiceInfo.paidAmount,
      settlementDate: invoiceInfo.settlementDate,
      statementId: invoiceInfo.statementId,
      createDate: invoiceInfo.createDate,
      updateDate: newDate,
    };

    try {
      const res = await CombinedService.update_invoice_details(
        invoiceInfo.invoiceId,
        invoice,
        makeAuthenticatedRequest,
      );
      if (res.invoiceId) {
        console.log("Updated invoice:", res);
        setInvoiceData((prevData: InvoiceData[]) =>
          prevData.map((item: InvoiceData) =>
            item.invoiceId === res.invoiceId ? { ...item, ...res } : item,
          ),
        );
        clearData();
        closePopUp();
      } else {
        console.error("Invalid response from update_invoice_details:", res);
      }
    } catch (err) {
      console.error("Error updating invoice:", err);
      // Optionally, show error notification to user
      addAlert(String(err), 'error', 10000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Conditionally render if invoiceInfo is invalid
  if (open && !isValidInvoiceInfo(invoiceInfo)) {
    // addAlert(String("Invalid invoice data. Please refresh your data"), 'error', 10000);
    return <div>Invalid invoice data. Please try again.</div>;
    // return <div></div>;
  }

  const isEditable = invoiceInfo.isPending || !invoiceInfo.isPaid;

  return (
    <>
      <Dialog
        open={open}
        onClose={closePopUp}
        fullWidth={true}
        maxWidth={"xl"}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          {title}
          <IconButton
            onClick={() => {
              closePopUp();
              clearData();
            }}
            style={{ float: "right" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div
            style={{ height: "700px", width: "100%" }}
            className="justify-left flex flex-row content-stretch items-start gap-50"
          >
            <form>
              <div className="w-xl flex h-full flex-row gap-4.5">
                <div className="flex flex-col content-stretch items-start justify-start gap-4.5">
                  <label className="text-body-sm text-red">
                    {error}
                  </label>
                  <label className="text-body-lg font-bold text-dark">
                    Invoice Information
                  </label>
                  <div className="mb-4.5 flex flex-row gap-4.5">
                    <InputGroup
                      label="Invoice No."
                      type="text"
                      placeholder="Enter invoice number"
                      value={formData.invoiceNum}
                      handleChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          invoiceNum: e.target.value,
                        }))
                      }
                      disabled
                      className="w-full xl:w-5/12"
                    />
                    <InputGroup
                      label="Amount"
                      type="number"
                      placeholder="Enter amount"
                      value={formData.amount.toString()}
                      handleChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          amount: +e.target.value,
                        }))
                      }
                      className="w-full xl:w-5/12"
                      disabled={!isEditable}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <MuiDatePicker
                        title="Invoice Date"
                        label="Invoice Date"
                        value={formData.invoiceDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            invoiceDate: e as Dayjs,
                          }))
                        }
                        disabled={!isEditable}
                      />
                    </LocalizationProvider>
                  </div>
                  <label className="text-body-lg font-bold text-dark">
                    Post Information
                  </label>
                  <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                    <AutoCompleteWithSelectorButton
                      title="Postcode"
                      placeholder="Enter Postcode"
                      dataArr={postSelectArray}
                      stateSetter={(value) =>
                        setFormData((prev) => ({ ...prev, postcode: value }))
                      }
                      input={formData.postcode}
                      disabled={!isEditable}
                    />
                    <InputGroup
                      label="Building Address"
                      type="text"
                      placeholder="Enter building address"
                      value={formData.buildingAddress}
                      handleChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          buildingAddress: e.target.value,
                        }))
                      }
                      className="w-full"
                      disabled={true}
                    />
                    <InputGroup
                      label="Street Address"
                      type="text"
                      placeholder="Enter street address"
                      value={formData.streetAddress}
                      handleChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          streetAddress: e.target.value,
                        }))
                      }
                      className="w-full"
                      disabled={true}
                    />
                  </div>
                  <label className="text-body-lg font-bold text-dark">
                    Client Information
                  </label>
                  <div className="flex flex-col">
                    <div className="mb-4.5 flex flex-row gap-4.5">
                      <InputGroup
                        label="Client Name"
                        type="text"
                        placeholder="Enter client name"
                        value={formData.clientName}
                        handleChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            clientName: e.target.value,
                          }))
                        }
                        className="w-full xl:w-5/12"
                        disabled={true}
                      />
                      <InputGroup
                        label="Full Name"
                        type="text"
                        placeholder="Enter client's full name"
                        value={formData.fullName}
                        handleChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            fullName: e.target.value,
                          }))
                        }
                        className="w-full xl:w-5/12"
                        disabled={true}
                      />
                    </div>
                    <TextAreaOne
                      label="Address"
                      placeholder="Enter Address"
                      value={formData.address}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setFormData((prev) => ({
                          ...prev,
                          address: e.currentTarget.value,
                        }))
                      }
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="w-1.5/2 h-full min-w-80">
                  <ChequeEditMuiDataGrid
                    dataArray={invoiceCheques}
                    setImageSrcToView={setPdfSrc}
                    windowOpen={open}
                    onClose={setPdfViewPopUp}
                    dataGridLoaded={dataGridLoaded}
                    setChequeCopy={setChequeCopy}
                    loadingInvoiceCheques={loadingInvoiceCheques}
                    setLoadingCheques={setLoadingCheques}
                    setDataGridLoaded={setDataGridLoaded}
                  />
                  {/* )} */}
                </div>
              </div>
              <Button
                className="mb-4 mt-4"
                label="Change"
                variant="green"
                shape="full"
                size="default"
                type="button"
                icon={<CheckIcon className="fill-white" />}
                onClick={submit}
                disabled={loadingCheques || isSubmitting}
              />
            </form>
          </div>
        </DialogContent>
      </Dialog>
      <PdfViewPopUp
        pdf={pdfSrc}
        open={pdfViewPopUp}
        setOpen={closePdfViewPopUp}
      />
    </>
  );
}

export default InvoiceEditPopUp;
