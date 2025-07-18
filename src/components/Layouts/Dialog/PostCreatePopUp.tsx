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
import { useAuthenticatedRequest } from "@/lib/auth";

type AutoCompleteArrayType = {
  key: string;
  name: string;
};

type ErrorType = {
  postcodeError: string;
  buildingAddressError: string;
  streetAddressError: string;
  clientNameError: string;
};

type PostCreatePopUpPropsType = {
  open: boolean;
  onClose: any;
  clientArray: AutoCompleteArrayType[];
  postArray: AutoCompleteArrayType[];
  postArrayWithDetails: post[]; // Optional prop for post array with details
  clientArrayWithDetails: client[]; // Optional prop for client array with details
  updatePostData: any;
};

function PostCreatePopUp({
  open,
  onClose,
  clientArray,
  postArray,
  postArrayWithDetails,
  clientArrayWithDetails,
  updatePostData,
}: PostCreatePopUpPropsType) {
  const [scroll, setScroll] = React.useState<DialogProps["scroll"]>("paper");

  const [clientName, setClientName] = useState("");
  const [fullName, setFullName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [buildingAddress, setBuildingAddress] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [address, setAddress] = useState("");

  const [error, setError] = useState<ErrorType>({
          postcodeError: "",
          buildingAddressError: "",
          streetAddressError: "",
          clientNameError: "",
});
  

  const { makeAuthenticatedRequest } = useAuthenticatedRequest();

  // useEffect(() => {
  //   postArrayWithDetails.find((postItem) => {
  //     if (postItem.postcode === postcode) {
  //       console.log("Postcode Found:", postItem);
  //       setBuildingAddress(postItem.buildingAddress);
  //       setStreetAddress(postItem.streetAddress);
  //       setClientName(postItem.client.clientName);
  //       setFullName(postItem.client.fullName);
  //       setAddress(postItem.client.address);
  //       return true; // Stop searching once we find a match
  //     }
  //     console.log("Postcode Not Found:");
  //     setBuildingAddress("");
  //     setStreetAddress("");
  //     setClientName("");
  //     setFullName("");
  //     setAddress("");
  //     return false; // Continue searching
  //   });
  // }, [postcode]);

  useEffect(() => {
      let found = false;
      clientArrayWithDetails.find((clientItem) => {
        if (clientItem.clientName === clientName) {
          console.log("Client Found:", clientItem);
          setFullName(clientItem.fullName);
          setAddress(clientItem.address);
          found = true; // Set found to true if a match is found
          return true; // Stop searching once we find a match
        }
      });
      if(!found){
        console.log("Client Not Found:");
        setFullName("");
        setAddress("");
      }
      
  }, [clientName]);

  const closePopUp = () => {
    onClose(false);
  };

  const handleClear = () => {
    setClientName("");
    setPostcode("");
    setBuildingAddress("");
    setStreetAddress("");
    setAddress("");
    setFullName("");
  };

  const checkInputError = () : boolean => {
        resetError();
        if(postcode === null || postcode === "") {
          setError((prev) => ({ ...prev, postcodeError: "* Postcode is required" }));
          return true;
        }
        if(buildingAddress === null || buildingAddress === "") {
          setError((prev) => ({ ...prev, buildingAddressError: "* Building Address is required" }));
          return true;
        }
        if(streetAddress === null || streetAddress === "") {
          setError((prev) => ({ ...prev, streetAddressError: "* Street Address is required" }));
          return true;
        }
        if(clientName === null || clientName === "") {
          setError((prev) => ({ ...prev, clientNameError: "* Client name is required" }));
          return true;
        }
        return false;
    }

    const resetError = () => {
        setError({
          postcodeError: "",
          buildingAddressError: "",
          streetAddressError: "",
          clientNameError: "",
        });
    }

  const handleAdd = () => {
    const postToAdd: post = {
      postcode: postcode,
      buildingAddress: buildingAddress,
      streetAddress: streetAddress,
      client: {
        clientName: clientName,
        fullName: fullName,
        address: address,
        clientId: 0,
        createDate: "",
        updateDate: ""
      },
      postId: 0,
      isEnded: false,
      createDate: "",
      updateDate: ""
    };
    console.log("Post to add:", postToAdd);
    CombinedService.create_post(postToAdd, makeAuthenticatedRequest)
      .then((response) => {
        console.log("Post created:", response);
        //getNewlyInsertedPost(response.postId);
        if (response) {
          //update List
          updatePostData();
        }
      })
      .catch((error) => {
        console.error("Error creating post:", error);
      }
    );
    // CombinedService.create_invoice(updateInvoice, makeAuthenticatedRequest)
    //   .then((response) => {
    //     console.log("Invoice created:", response);
    //     //getNewlyInsertedInvoice(response.invoiceId);
    //     if (response) {
    //       //update List
    //       updateInvoiceData();
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Error creating invoice:", error);
    //   });
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
          Create Post{" "}
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
                  Post
                </label>
                <AutoCompleteWithSelectorButton
                  title="Postcode"
                  placeholder="Enter Postcode"
                  dataArr={[]}
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
                  if(checkInputError())
                    return;
                  handleAdd();
                  handleClear();
                  onClose(false);
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PostCreatePopUp;
