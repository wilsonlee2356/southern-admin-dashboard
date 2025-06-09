// SearchBox.tsx
"use client";

import React, { useState } from "react";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";
import AutoCompleteWithSelectorButton from "@/components/FormElements/AutoCompletes/AutoCompleteWithSelectorButton";
import AutoCompleteWithoutSelectorButton from "@/components/FormElements/AutoCompletes/AutoCompleteWithoutSelectorButton";
import NumberInput from "@/components/FormElements/InputGroup/NumberInputs/NumberInput";
import DropdownList from "@/components/FormElements/Dropdown/DropdownList";
import { client, post, invoice, invoiceData, postClientInvoiceSummary } from "@/types/ObjectTypes/InvoiceType";
import { CloseIcon, SearchIcon, UploadIcon } from "@/assets/icons";
import { MuiCheckbox } from "@/components/FormElements/Checkboxes/MuiCheckbox";
import { CombinedService } from "@/app/api/invoice";
import InvoiceCreatePopUp from "@/components/Layouts/Dialog/InvoiceCreatePopUp";
import MuiDatePicker from "@/components/FormElements/DatePicker/MuiDatePicker";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

type PostSearchBoxProps = {
  dataArray: invoiceData[]; // Pass data as a prop instead of fetching here
  clientData: client[];
  postData: post[];
  clientName: string;
  postcode: string;
  showNotEndedPosts: boolean;
  showEndedPosts: boolean;
  // amount: string;
  // Setters for the state variables
  setClientName:any;
  setPostcode:any;
  // setAmount:any;
  setFilteredData: any;
  setUpdateDataNeeded : any;
  setShowNotEndedPosts: any;
  setShowEndedPosts: any;
};



const PostSearchBox = ({ dataArray, clientData, postData, clientName, postcode, showNotEndedPosts, showEndedPosts, setClientName, setPostcode, setFilteredData, setUpdateDataNeeded, setShowEndedPosts, setShowNotEndedPosts }: PostSearchBoxProps) => {

  const [popUpOpen, setPopUpOpen] = useState(false);

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
  // const invoiceNumArr = dataArray.map((item) => ({ 
  //   key: item.invoiceId.toString(),
  //   name: item.invoiceNum.toString(), }));
  // const clientNameArr = dataArray.map((item) => ({
  //   key: item.invoiceId.toString(),
  //   name: item.client.clientName,
  // }));
  // const postcodeArr = dataArray.map((item) => ({
  //   key: item.invoiceId.toString(),
  //   name: item.post.postcode,
  // }));

  const handleClear = () => {
    console.log("Clearing filters...: ", dataArray);
    setFilteredData(dataArray); // Reset to original data
    setClientName("");
    setPostcode("");
  };
  
  

  // const checkDateWithinMonths = (date: Date, months: number) => {
  //   const currentDate = new Date();
  //   const targetDate = new Date(date);
  //   targetDate.setMonth(targetDate.getMonth() + months);
  //   return currentDate <= targetDate;
  // };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log("Handle submit");
  //   // console.log({ 
  //   //   invoiceNumber, 
  //   //   clientName, postcode, amount, period });
  //   // Add your search logic here

  //   // const searchResult = GET_INVOICE_BY_ID(invoiceNumber);
  //   // searchResult.then((result) => {
  //   //   console.log("Search result:", result);
  //   // }).catch((error) => {
  //   //   console.error("Error fetching invoice:", error);
  //   // });
  //   //console.log("Search result:", searchResult);
  //   const currentDate = new Date();
  //   //console.log("Date compare:", );

  //   const checkEmpty = (value: string) => {
  //     return value === "" || value === undefined || value === null; 
  //   };

  //   const selectedData = dataArray.filter((row: any) =>
  //     (
  //       !checkEmpty(invoiceNumber) && row.invoiceNum.includes(invoiceNumber) || 
  //       !checkEmpty(clientName) && row.post.client.clientName.toLowerCase().includes(clientName.toLowerCase()) || 
  //       !checkEmpty(postcode) && row.post.postcode.toLowerCase().includes(postcode.toLowerCase()) || 
  //       !checkEmpty(amount) && /^\d+$/.test(amount) && row.amount.includes===amount || 
  //       !checkEmpty(period) && checkDateWithinMonths(row.invoiceDate, parseInt(period))
  //     )
  //   );
  //   //console.log("invoice selected:", dataArray[0].id.includes(invoiceNumber));
  //   setFilteredData(selectedData);
  //   console.log("Filtered data:", selectedData);
  // };

  


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
            input ={clientName}
          />
          <AutoCompleteWithSelectorButton
            title="Postcode"
            placeholder="Enter Postcode"
            dataArr={postcodeArr}
            stateSetter={setPostcode}
            input ={postcode}
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
          
          {/* <Checkbox
            label="Ended Posts"
            name="showEndedPosts"
            // checked={showEndedPosts}
            // onChange={(e) => setShowEndedPosts(e.target.checked)}
          /> */}
        </div>
        <div className="flex flex-col gap-4 xl:flex-row xl:justify-center">
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
