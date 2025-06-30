"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui-elements/button";
import { CheckIcon } from "@/assets/icons";
import {
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AutoCompleteWithSelectorButton from "@/components/FormElements/AutoCompletes/AutoCompleteWithSelectorButton";
import MuiDatePicker from "@/components/FormElements/DatePicker/MuiDatePicker";
import TextInputHeroUI from "@/components/FormElements/InputGroup/text-input-heroui";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import {
  client,
  post,
  invoiceDataOutput,
} from "@/types/ObjectTypes/InvoiceType";
import { CombinedService } from "@/app/api/invoice";

type AutoCompleteArrayType = {
  key: string;
  name: string;
};

type InvoiceCreatePopUpPropsType = {
  open: boolean;
  onClose: any;
  setUpdateDataNeeded: any;
  // invoiceArray: AutoCompleteArrayType[]; // Pass data as a prop instead of fetching here
  clientArray: AutoCompleteArrayType[];
  postArray: AutoCompleteArrayType[];
  postArrayWithDetails: post[]; // Optional prop for post array with details
  clientArrayWithDetails: client[]; // Optional prop for client array with details
};

function InvoiceCreatePopUp({
  open,
  onClose,
  setUpdateDataNeeded,
  clientArray,
  postArray,
  postArrayWithDetails,
  clientArrayWithDetails,
}: InvoiceCreatePopUpPropsType) {
  const [scroll, setScroll] = React.useState<DialogProps["scroll"]>("paper");
  //const [invoiceDate, setInvoiceDate] = useState<Dayjs | null>(null);
  const [chequeFile, setChequeFile] = React.useState<File | null>(null);
  const [statementFile, setStatementFile] = React.useState<File | null>(null);

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [fullName, setFullName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [buildingAddress, setBuildingAddress] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [invoiceDate, setInvoiceDate] = useState<Dayjs | null>(dayjs());

  useEffect(() => {
    postArrayWithDetails.find((postItem) => {
      if (postItem.postcode === postcode) {
        setBuildingAddress(postItem.buildingAddress);
        setStreetAddress(postItem.streetAddress);
        return true; // Stop searching once we find a match
      }
      return false; // Continue searching
    });
    clientArrayWithDetails.find((clientItem) => {
      if (clientItem.clientName === clientName) {
        setFullName(clientItem.fullName);
        setAddress(clientItem.address);
        return true; // Stop searching once we find a match
      }
      return false; // Continue searching
    });
  }, [postcode, clientName]);

  // React.useEffect(() => {
  //     if (open) {
  //     const { current: descriptionElement } = descriptionElementRef;
  //     if (descriptionElement !== null) {
  //         descriptionElement.focus();
  //     }
  //     }
  // }, [open]);

  const closePopUp = () => {
    onClose(false);
  };

  const handleClear = () => {
    setInvoiceNumber("");
    setClientName("");
    setPostcode("");
    setBuildingAddress("");
    setStreetAddress("");
    setAddress("");
    setAmount("");
    setFullName("");
    setInvoiceDate(dayjs());
  };

  const handleAdd = () => {
    const updateInvoice: invoiceDataOutput = {
      invoiceNum: invoiceNumber,
      post: {
        postcode: postcode,
        buildingAddress: buildingAddress,
        streetAddress: streetAddress,
        client: {
          clientName: clientName,
          fullName: fullName,
          address: address,
        },
      },
      paidAmount: 0,
      invoiceDate: invoiceDate?.toDate(),
      amount: parseFloat(amount),
      settlementDate: null,
      statementId: null,
    };
    CombinedService.create_invoice(updateInvoice)
      .then((response) => {
        console.log("Invoice created:", response);
        //getNewlyInsertedInvoice(response.invoiceId);
        if (response) {
          //update List
          setUpdateDataNeeded(true);
        }
      })
      .catch((error) => {
        console.error("Error creating invoice:", error);
      });
  };

  // const invoiceNumArr = dataArray.map((item) => ({
  // key: item.invoiceId.toString(),
  // name: item.invoiceNum.toString(), }));
  // const clientNameArr = clientData.map((item) => ({
  //     key: item.clientId.toString(),
  //     name: item.clientName,
  // }));
  // const postcodeArr = postData.map((item) => ({
  //     key: item.postId.toString(),
  //     name: item.postcode,
  // }));
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth={true}
        maxWidth={"xl"}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        scroll={scroll}
      >
        <DialogTitle>
          {" "}
          Create Invoice{" "}
          <IconButton onClick={closePopUp} style={{ float: "right" }}>
            <CloseIcon></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <div
            style={{ height: "600px", width: "100%" }}
            className="mb-10 flex-col content-stretch justify-center"
          >
            <div className="flex flex-row gap-4.5 xl:flex-row">
              <div className="flex w-full flex-col gap-2.5">
                <label className="text-body-lg text-center font-medium text-dark dark:text-white">
                  Invoice
                </label>
                <TextInputHeroUI
                  className="w-4/7"
                  label="Invoice Number"
                  placeholder="Enter Invoice Number"
                  value={invoiceNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setInvoiceNumber(e.currentTarget.value)
                  }
                />
                {/* <AutoCompleteWithSelectorButton title="Invoice Number" placeholder="Enter Invoice Number" dataArr={invoiceArray} input={invoiceNumber} stateSetter={setInvoiceNumber}/> */}
                {/* <AutoCompleteWithSelectorButton title="Client Name" placeholder="Enter Client Name" dataArr={clientArray} input={clientName} stateSetter={setClientName}/>
                                <AutoCompleteWithSelectorButton title="Postcode" placeholder="Enter Postcode" dataArr={postArray} input={postcode} stateSetter={setPostcode}/>
                                <TextAreaOne label="Address" placeholder="Enter Address" value={address} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAddress(e.currentTarget.value)}/> */}
                <TextInputHeroUI
                  className="w-full"
                  label="Amount"
                  placeholder="Enter Amount"
                  value={amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setAmount(e.currentTarget.value)
                  }
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MuiDatePicker
                    title="Invoice Date"
                    label="Invoice Date"
                    value={invoiceDate}
                    onChange={(newValue) => setInvoiceDate(newValue)}
                  />
                </LocalizationProvider>
              </div>
              <div className="flex w-full flex-col gap-2.5">
                <label className="text-body-lg text-center font-medium text-dark dark:text-white">
                  Client
                </label>
                <AutoCompleteWithSelectorButton
                  title="Client Name"
                  placeholder="Enter Client Name"
                  dataArr={clientArray}
                  input={clientName}
                  stateSetter={setClientName}
                />
                <TextInputHeroUI
                  className="w-full"
                  label="Full Name"
                  placeholder="Enter Full Name"
                  value={fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFullName(e.currentTarget.value);
                  }}
                />
                <TextInputHeroUI
                  className="w-full"
                  label="Address"
                  placeholder="Enter Address"
                  value={address}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setAddress(e.currentTarget.value);
                  }}
                />
              </div>
              <div className="flex w-full flex-col gap-2.5">
                <label className="text-body-lg text-center font-medium text-dark dark:text-white">
                  Post
                </label>
                <AutoCompleteWithSelectorButton
                  title="Postcode"
                  placeholder="Enter Postcode"
                  dataArr={postArray}
                  input={postcode}
                  stateSetter={setPostcode}
                />
                <TextInputHeroUI
                  className="w-full"
                  label="Building Address"
                  placeholder="Enter Building Address"
                  value={buildingAddress}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setBuildingAddress(e.currentTarget.value)
                  }
                />
                <TextInputHeroUI
                  className="w-full"
                  label="Street Address"
                  placeholder="Enter Street Address"
                  value={streetAddress}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setStreetAddress(e.currentTarget.value)
                  }
                />
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-5 xl:flex-row xl:justify-center">
              <Button
                label="Clear"
                variant="outlinePrimary"
                shape="full"
                size="default"
                icon={<CloseIcon />}
                onClick={() => {
                  handleClear();
                }}
              />

              <Button
                label="Create"
                variant="green"
                shape="full"
                size="default"
                icon={<CheckIcon className="fill-white" />}
                onClick={() => {
                  handleAdd();
                  handleClear();
                  onClose(false);
                  // console.log("Invoice Date: ", invoiceDate);
                  // if(invoiceDate !== null) {
                  //     setDataArray((prevData: any) => {
                  //     return prevData.map((item: any) => {
                  //         dataArray.map((invoiceInfo: invoiceData) => {
                  //             if (item.invoiceId === invoiceInfo.invoiceId) {
                  //                 item.settlementDate = invoiceDate.toISOString();
                  //                 //console.log(item);
                  //             }

                  //             return item;
                  //         }
                  //         );
                  //     });
                  // });
                  // }
                }}
              />
            </div>
            {/* <div className="flex flex-col gap-4.5 xl:flex-row">
                        
                    </div> */}
            {/* <div className="mb-1 flex flex-col gap-4.5 xl:flex-row">
                    <div className="w-full xl:w-4/12">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MuiDatePicker
                            title="Invoice Date"
                            label="Invoice Date"
                            value={invoiceDate}
                            onChange={(newValue) => setInvoiceDate(newValue)}
                        />
                        </LocalizationProvider>
                    </div>
                    </div> */}
          </div>
        </DialogContent>
        {/* <DialogContent>
                <Button
                    label="Create"
                    variant="green"
                    shape="full"
                    size="default"
                    icon={<CheckIcon className="fill-white" />}
                    onClick={() => {
                        // console.log("Invoice Date: ", invoiceDate);
                        // if(invoiceDate !== null) {
                        //     setDataArray((prevData: any) => {
                        //     return prevData.map((item: any) => {
                        //         dataArray.map((invoiceInfo: invoiceData) => {
                        //             if (item.invoiceId === invoiceInfo.invoiceId) {
                        //                 item.settlementDate = invoiceDate.toISOString();
                        //                 //console.log(item);
                        //             }
                                    
                        //             return item;
                        //         }
                        //         );
                        //     });
                        // });
                        // }
                        
                    }}
                />
            </DialogContent> */}
      </Dialog>
    </>
  );
}

export default InvoiceCreatePopUp;
