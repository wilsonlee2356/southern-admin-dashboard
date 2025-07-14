// SearchBox.tsx
"use client";

import React, { useState } from "react";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";
import AutoCompleteWithSelectorButton from "@/components/FormElements/AutoCompletes/AutoCompleteWithSelectorButton";
import { client, post, invoiceData } from "@/types/ObjectTypes/InvoiceType";
import { CloseIcon, RefreshIcon, SpinningRefreshIcon} from "@/assets/icons";
import { MuiCheckbox } from "@/components/FormElements/Checkboxes/MuiCheckbox";
import { usePostClientContent } from "@/utils/post-client-content";

type PostSearchBoxProps = {
  // dataArray: invoiceData[]; // Pass data as a prop instead of fetching here
  clientData: client[];
  postData: post[];
  clientName: string;
  postcode: string;
  showNotEndedPosts: boolean;
  showEndedPosts: boolean;
  // amount: string;
  // Setters for the state variables
  setClientName: any;
  setPostcode: any;
  // setAmount:any;
  setFilteredData: any;
  setUpdateDataNeeded: any;
  setShowNotEndedPosts: any;
  setShowEndedPosts: any;
};

const PostSearchBox = ({
  // dataArray,
  clientData,
  postData,
  clientName,
  postcode,
  showNotEndedPosts,
  showEndedPosts,
  setClientName,
  setPostcode,
  setFilteredData,
  setShowEndedPosts,
  setShowNotEndedPosts,
}: PostSearchBoxProps) => {

  const { updateData, refreshLoading } = usePostClientContent();

  const clientNameArr = clientData.map((item) => ({
    key: item.clientId.toString(),
    name: item.clientName,
  }));
  const postcodeArr = postData.map((item) => ({
    key: item.postId.toString(),
    name: item.postcode,
  }));

  React.useEffect(() => {
    console.log("client array:", clientNameArr);
    console.log("post array:", postcodeArr);
  }, []);

  const handleClear = () => {
    // console.log("Clearing filters...: ", dataArray);
    // setFilteredData(dataArray); // Reset to original data
    setClientName("");
    setPostcode("");
  };
  const handleRefreshClick = () => {
    updateData();
  };

  return (
    <ShowcaseSection title="Post Management" className="!p-6.5">
      {/* <form onSubmit={handleSubmit}> */}
      <form>
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <AutoCompleteWithSelectorButton
            title="Client Name"
            placeholder="Enter Client Name"
            dataArr={clientNameArr}
            stateSetter={setClientName}
            input={clientName}
          />
          <AutoCompleteWithSelectorButton
            title="Postcode"
            placeholder="Enter Postcode"
            dataArr={postcodeArr}
            stateSetter={setPostcode}
            input={postcode}
          />
        </div>
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <MuiCheckbox
            label="Unfinished Posts"
            name="unfinishedPosts"
            checked={showNotEndedPosts}
            onChange={(e) => setShowNotEndedPosts(e.target.checked)}
          />

          <MuiCheckbox
            label="Finished Posts"
            name="finishedPosts"
            checked={showEndedPosts}
            onChange={(e) => setShowEndedPosts(e.target.checked)}
          />
        </div>
        <div className="flex flex-col gap-4 xl:flex-row xl:justify-center">
          <Button
            label="Refresh Data"
            variant={refreshLoading ? "outlineBlueDiabled" : "outlineBlue"}
            shape="full"
            size="small"
            disabled = {refreshLoading}
            icon={refreshLoading ? <SpinningRefreshIcon /> : <RefreshIcon className="fill-blue"/>}
            onClick={() => {
              handleRefreshClick();
            }}
          />
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
        </div>
      </form>
      {/* <InvoiceCreatePopUp
        open={popUpOpen}
        onClose={setPopUpOpen}
        setUpdateDataNeeded={setUpdateDataNeeded}
        invoiceArray={invoiceNumArr}
        clientArray={clientNameArr}
        postArray={postcodeArr}
      /> */}
    </ShowcaseSection>
  );
};
export default PostSearchBox;
