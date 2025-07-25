"use client";
import CustomPopUp from "@/components/Layouts/Dialog/PopUp";
import React, { useState, useEffect } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import MuiDatePicker from "@/components/FormElements/DatePicker/MuiDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { post } from "@/types/ObjectTypes/InvoiceType";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

// TypeScript Interfaces


interface EditPostPopUpPropsType {
  title: string;
  open: boolean;
  onClose: (open: boolean) => void;
  postEditing: post | null;
}

interface FormData {
  postcode: string;
  clientName: string;
  fullName: string;
  buildingAddress: string;
}

function EditPostPopUp({
    title,
    open,
    onClose,
    postEditing,
}: EditPostPopUpPropsType) {
    const [formData, setFormData] = useState<FormData>({
        postcode: "",
        clientName: "",
        fullName: "",
        buildingAddress: "",
    });

    React.useEffect(() => {
        if(postEditing !== null){
          setFormData({
            postcode: postEditing.postcode,
            clientName: postEditing.client.clientName,
            fullName: (postEditing.client.fullName) ? postEditing.client.fullName : "",
            buildingAddress: postEditing.buildingAddress,
          });
        }
    }, [postEditing]);

  // Close dialog
  const closePopUp = () => {
    onClose(false);
  };

  if(postEditing === null){
    return <CustomPopUp
            title={title}
            open={open}
            onClose={onClose}>
              <div>No Invoice loaded</div>
            </CustomPopUp>;
  }

  return (
    <>
        <CustomPopUp
            title={title}
            open={open}
            onClose={onClose}>
            <div
                style={{ height: "700px", width: "100%" }}
                className="justify-left flex flex-row content-stretch items-start gap-5">
                <div className="flex flex-col content-stretch items-start justify-start gap-4.5">
                  {/* <label className="text-body-sm text-red">
                    {error}
                  </label> */}
                  <label className="text-body-lg font-bold text-dark">
                    Post Information
                  </label>
                  <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                    {/* <AutoCompleteWithSelectorButton
                      title="Postcode"
                      placeholder="Enter Postcode"
                      dataArr={postSelectArray}
                      stateSetter={(value) =>
                        setFormData((prev) => ({ ...prev, postcode: value }))
                      }
                      input={formData.postcode}
                      disabled={!isEditable}
                    /> */}
                    <InputGroup
                      label="Postcode"
                      type="text"
                      placeholder="Enter street address"
                      value={formData.postcode}
                      handleChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          postcode: e.target.value,
                        }))
                      }
                      className="w-full"
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
                      />
                    </div>
                    {/* <TextAreaOne
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
                    /> */}
                  </div>
                {/* </div>
                </div> */}
                </div>
            </div>
        </CustomPopUp>
    </>
  );
}

export default EditPostPopUp;
