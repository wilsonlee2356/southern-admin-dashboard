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
import NumberInputHeroUI from "@/components/FormElements/InputGroup/NumberInputs/number-input-heroui";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import {
  client,
  post,
  invoiceDataOutput,
} from "@/types/ObjectTypes/InvoiceType";
import { CombinedService } from "@/app/api/invoice";
import { useAuthenticatedRequest } from "@/lib/auth";
import { usePostClientContent } from "@/utils/post-client-content";

type AutoCompleteArrayType = {
  key: string;
  name: string;
};

type ErrorType = {
  invoiceNumError: string;
  amountError: string;
  invoiceDateError: string;
  clientNameError: string;
  postcodeError: string;
  buildingAddressError: string;
  streetAddressError: string;
  fullNameError: string;
  addressError: string;
};

type InvoiceCreatePopUpPropsType = {
  open: boolean;
  onClose: any;
  setUpdateDataNeeded: any;
  clientArray: AutoCompleteArrayType[];
  postArray: AutoCompleteArrayType[];
  postArrayWithDetails: post[]; // Optional prop for post array with details
  clientArrayWithDetails: client[]; // Optional prop for client array with details
  updateInvoiceData: any;
};

function InvoiceCreatePopUp({
  open,
  onClose,
  setUpdateDataNeeded,
  clientArray,
  postArray,
  postArrayWithDetails,
  clientArrayWithDetails,
  updateInvoiceData,
}: InvoiceCreatePopUpPropsType) {
  const [scroll, setScroll] = React.useState<DialogProps["scroll"]>("paper");

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [fullName, setFullName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [buildingAddress, setBuildingAddress] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState<number | undefined>();
  const [invoiceDate, setInvoiceDate] = useState<Dayjs | null>(null);
  const [error, setError] = useState<ErrorType>({
    invoiceNumError: "",
    amountError: "",
    invoiceDateError: "",
    clientNameError: "",
    postcodeError: "",
    buildingAddressError: "",
    streetAddressError: "",
    fullNameError: "",
    addressError: "",
  });

  const { makeAuthenticatedRequest } = useAuthenticatedRequest();

  const { setInvoiceData } = usePostClientContent();

  useEffect(() => {
    postArrayWithDetails.find((postItem) => {
      if (postItem.postcode === postcode) {
        console.log("Postcode Found:", postItem);
        setBuildingAddress(postItem.buildingAddress);
        setStreetAddress(postItem.streetAddress);
        setClientName(postItem.client.clientName);
        setFullName(postItem.client.fullName);
        setAddress(postItem.client.address);
        return true; // Stop searching once we find a match
      }
      console.log("Postcode Not Found:");
      setBuildingAddress("");
      setStreetAddress("");
      setClientName("");
      setFullName("");
      setAddress("");
      return false; // Continue searching
    });
  }, [postcode]);

  useEffect(() => {
    if(clientName !== ""){
      clientArrayWithDetails.find((clientItem) => {
        if (clientItem.clientName === clientName) {
          console.log("Client Found:", clientItem);
          setFullName(clientItem.fullName);
          setAddress(clientItem.address);
          return true; // Stop searching once we find a match
        }
        console.log("Client Not Found:");
        setFullName("");
        setAddress("");
        return false; // Continue searching
      });
    }
  }, [clientName]);

  const closePopUp = () => {
    handleClear();
    onClose(false);
  };

  const resetError = () => {
    setError({
      invoiceNumError: "",
      amountError: "",
      invoiceDateError: "",
      clientNameError: "",
      postcodeError: "",
      buildingAddressError: "",
      streetAddressError: "",
      fullNameError: "",
      addressError: "",
    });
  }

  const handleClear = () => {
    console.log("Invoice create clear");
    setInvoiceNumber("");
    setClientName("");
    setPostcode("");
    setBuildingAddress("");
    setStreetAddress("");
    setAddress("");
    setAmount(undefined);
    setFullName("");
    setInvoiceDate(null);
  };

  const checkInputError = () : boolean => {
    resetError();
    if(invoiceNumber === "") {
      setError((prev) => ({ ...prev, invoiceNumError: "* Invoice Number is required" }));
      return true;
    }
    if(!amount || amount <= 0) {
      setError((prev) => ({ ...prev, amountError: "* Amount must be greater than 0" }));
      return true;
    }
    if(!invoiceDate) {
      setError((prev) => ({ ...prev, invoiceDateError: "* Invoice Date is required" }));
      return true;
    }
    if(postcode === "") {
      setError((prev) => ({ ...prev, postcodeError: "* Postcode is required" }));
      return true;
    }
    if(buildingAddress === "") {
      setError((prev) => ({ ...prev, buildingAddressError: "* Building Address is required" }));
      return true;
    }
    if(streetAddress === "") {
      setError((prev) => ({ ...prev, streetAddressError: "* Street Address is required" }));
      return true;
    }
    if(clientName === "") {
      setError((prev) => ({ ...prev, clientNameError: "* Client Name is required" }));
      return true;
    }
    // if(fullName === "") {
    //   setError((prev) => ({ ...prev, fullNameError: "* Full Name is required" }));
    //   return true;
    // }
    // if(address === "") {
    //   setError((prev) => ({ ...prev, addressError: "* Address is required" }));
    //   return true;
    // }
    return false;
  }
  const handleAdd = () :boolean => {
    if(checkInputError()){
      return false;
    }
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
      amount: (amount) ? amount : 0,
      settlementDate: null,
      statementId: null,
    };
    CombinedService.create_invoice(updateInvoice, makeAuthenticatedRequest)
      .then((response) => {
        console.log("Invoice created:", response);
        //getNewlyInsertedInvoice(response.invoiceId);
        if (response) {
          //update List
          // updateInvoiceData();
          setInvoiceData((prevInvoices: invoiceDataOutput[]) => [
            ...prevInvoices,
            response,
          ]);
        }
      })
      .catch((error) => {
        console.error("Error creating invoice:", error);
      });
    return true;
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
                  error={error.invoiceNumError}
                />
                <NumberInputHeroUI
                  className="w-full"
                  label="Amount"
                  placeholder="Enter Amount"
                  value={amount}
                  onChange={setAmount}
                  error={error.amountError}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MuiDatePicker
                    title="Invoice Date"
                    label="Invoice Date"
                    value={invoiceDate}
                    onChange={(newValue) => setInvoiceDate(newValue)}
                    error={error.invoiceDateError}
                  />
                </LocalizationProvider>
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
                  error={error.postcodeError}
                />
                <TextInputHeroUI
                  className="w-full"
                  label="Building Address"
                  placeholder="Enter Building Address"
                  value={buildingAddress}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setBuildingAddress(e.currentTarget.value)
                  }
                  error={error.buildingAddressError}
                />
                <TextInputHeroUI
                  className="w-full"
                  label="Street Address"
                  placeholder="Enter Street Address"
                  value={streetAddress}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setStreetAddress(e.currentTarget.value)
                  }
                  error={error.streetAddressError}
                />
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
                  error={error.clientNameError}
                />
                <TextInputHeroUI
                  className="w-full"
                  label="Full Name"
                  placeholder="Enter Full Name"
                  value={fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFullName(e.currentTarget.value);
                  }}
                  error={error.fullNameError}
                />
                <TextInputHeroUI
                  className="w-full"
                  label="Address"
                  placeholder="Enter Address"
                  value={address}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setAddress(e.currentTarget.value);
                  }}
                  error={error.addressError}
                />
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-5 xl:flex-row xl:justify-center">
              <Button
                aria-label="Clear button"
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
                aria-label="Create button"
                label="Create"
                variant="green"
                shape="full"
                size="default"
                icon={<CheckIcon className="fill-white" />}
                onClick={() => {
                  const canAdd = handleAdd();
                  if(canAdd){
                    handleClear();
                    resetError();
                    onClose(false);
                  }
                  
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default InvoiceCreatePopUp;
