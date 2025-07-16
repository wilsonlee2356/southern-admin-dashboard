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
import TextInputHeroUIDisabled from "@/components/FormElements/InputGroup/text-input-heroui-disabled";
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

type PostEditPopUpPropsType = {
  open: boolean;
  onClose: any;
  postToEdit: post; // Optional prop for post array with details
  updatePostData: any;
};

function PostEditPopUp({
  open,
  onClose,
  postToEdit,
  updatePostData,
}: PostEditPopUpPropsType) {
  const [scroll, setScroll] = React.useState<DialogProps["scroll"]>("paper");

  const [clientName, setClientName] = useState("");
  const [fullName, setFullName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [buildingAddress, setBuildingAddress] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [address, setAddress] = useState("");

  const { makeAuthenticatedRequest } = useAuthenticatedRequest();

  const closePopUp = () => {
    onClose(false);
  };

  useEffect(() => {
    if (postToEdit&& postToEdit.client) {
      setClientName(postToEdit.client.clientName);
      setFullName(postToEdit.client.fullName);
      setPostcode(postToEdit.postcode);
      setBuildingAddress(postToEdit.buildingAddress);
      setStreetAddress(postToEdit.streetAddress);
      setAddress(postToEdit.client.address);
    }
  }, [postToEdit]);

  const handleAdd = () => {
    const postToAdd: post = {
      postcode: postToEdit.postcode,
      buildingAddress: buildingAddress,
      streetAddress: streetAddress,
      client: {
        clientName: postToEdit.client.clientName,
        fullName: fullName,
        address: address,
        clientId: postToEdit.client.clientId,
        createDate: "",
        updateDate: ""
      },
      postId: postToEdit.postId,
      isEnded: postToEdit.isEnded,
      createDate: "",
      updateDate: ""
    };
    console.log("Post to update:", postToAdd);
    CombinedService.update_post_client_details(postToEdit.postId, postToAdd, makeAuthenticatedRequest)
      .then((response) => {
        console.log("Post updated:", response);
        //getNewlyInsertedPost(response.postId);
        if (response) {
          //update List
          updatePostData();
        }
      })
      .catch((error) => {
        console.error("Error updating post:", error);
      }
    );
  };

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
          Edit Post and Client{" "}
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
                <TextInputHeroUIDisabled
                  className="w-full"
                  label="Postcode"
                  placeholder="Enter Postcode"
                  value={postcode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {}}
                  disabled={true}
                />
                {/* <AutoCompleteWithSelectorButton
                  title="Postcode"
                  placeholder="Enter Postcode"
                  dataArr={[]}
                  input={postcode}
                  stateSetter={setPostcode}
                  disabled={true}
                /> */}
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
              <div className="flex w-full flex-col gap-2.5">
                <label className="text-body-lg text-center font-medium text-dark dark:text-white">
                  Client
                </label>
                {/* <AutoCompleteWithSelectorButton
                  title="Client Name"
                  placeholder="Enter Client Name"
                  dataArr={[]}
                  input={clientName}
                  stateSetter={setClientName}
                  disabled={true}
                /> */}
                <TextInputHeroUIDisabled
                  className="w-full"
                  label="Client Name"
                  placeholder="Enter Client Name"
                  value={clientName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {}}
                  disabled={true}
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

            <div className="mt-10 flex flex-col gap-5 xl:flex-row xl:justify-start">

              <Button
                label="Update"
                variant="green"
                shape="full"
                size="default"
                icon={<CheckIcon className="fill-white" />}
                onClick={() => {
                  handleAdd();
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

export default PostEditPopUp;
