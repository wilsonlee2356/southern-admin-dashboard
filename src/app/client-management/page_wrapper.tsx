"use client";
import { useState, useEffect } from "react";
import { client, post, invoiceData, postClientInvoiceSummary } from "@/types/ObjectTypes/InvoiceType";
import PostSearchBox from "./_components/post-search-box";
import { CombinedService } from "@/app/api/invoice";
import { InvoiceService } from "../api/services/invoiceService";
import MuiDataGridForPostManagement from "@/components/Tables/DataGrid/MuiDataGridForPostManagement";

type PageWrapperProps = {
  dataArray: invoiceData[]; // Pass data as a prop instead of fetching here
  clientData: client[];
  postData: post[];
};

export default function PageWrapper({ dataArray, clientData, postData }: PageWrapperProps) {
  const [dataToShow, setDataToShow] = useState<invoiceData[]>([]);//0 = NumberOfInvoices, 1 = TotalAmount, 2 = TotalOutstandingAmount, 3 = post_id, 4 = postcode, 5 = is_ended, 6 = clientName
//   const [invoiceNumber, setInvoiceNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [postcode, setPostcode] = useState("");
//   const [amount, setAmount] = useState("");
//   const [period, setPeriod] = useState("");
  const [popUpOpen, setPopUpOpen] = useState(false);
  const [popUpOpenEdit, setPopUpOpenEdit] = useState(false);
  const [showNotEndedPosts, setShowNotEndedPosts] = useState(true);
  const [showEndedPosts, setShowEndedPosts] = useState(false);
  const [updateDataNeeded, setUpdateDataNeeded] = useState(false);

  let data =  dataArray;
  let clients = clientData;
  let posts = postData;
  // useEffect(() => {
  //   console.log( typeof dataArray[0].postcode  );
  //   setDataToShow(dataArray);
  // }, []);

  // useEffect(() => {
  //   console.log( showEndedPosts, showNotEndedPosts, showNotEndedPosts && !dataArray[0].ended );
  // }, [showEndedPosts, showNotEndedPosts]);

  useEffect(() => {
    
    const selectedData : invoiceData[] = dataArray.filter((row: invoiceData) =>
      (
        (!checkEmpty(clientName) ? row.post.client.clientName.toLowerCase().includes(clientName.toLowerCase()) : true) && 
        (!checkEmpty(postcode) ? row.post.postcode.toLowerCase().includes(postcode.toLowerCase()) : true) &&
        (showNotEndedPosts && !row.post.isEnded) ||
        (showEndedPosts && row.post.isEnded)
        
        //&& (!checkEmpty(startDate) ? checkDateWithinMonths(row.invoiceDate, parseInt(startDate)) : true)
      )
    );
    setDataToShow(selectedData);
    console.log("Filtered post data: ", selectedData);
    //console.log("Type ", selectedData = dataArray);
  }, [clientName, postcode, showNotEndedPosts, showEndedPosts, dataArray]);

  useEffect(() => {
      if(updateDataNeeded){
        console.log("Updating data");
        InvoiceService.getAll().then((res) => {
          dataArray = res;
          setDataToShow(res);
        }
        );
        CombinedService.get_all_client().then((res) => {
          clients = res;
        }
        );
        CombinedService.get_all_post().then((res) => {
          posts = res;
        }
        );
        setUpdateDataNeeded(false);
        
      }
    }, [updateDataNeeded]);

  const checkEmpty = (value: string) => {
    return value === "" || value === undefined || value === null; 
  };

  return (
    <>
      {/* <InputBox dataArray={dataArray} clientData={clientData} postData={postData} setDataToShow={setDataToShow}/>
      <MuiDataGridWithPopUpButton
        dataArray={dataToShow}
        popUpOpen={popUpOpen}
        setPopUpOpen={setPopUpOpen}
        popUpOpenEdit={popUpOpenEdit}
        setPopUpOpenEdit={setPopUpOpenEdit}
        setFilteredData={setDataToShow}
      /> */}
      <PostSearchBox
        dataArray={dataToShow}
        clientData={clients}
        postData={posts}
        clientName={clientName}
        postcode={postcode}
        showEndedPosts={showEndedPosts}
        showNotEndedPosts={showNotEndedPosts}
        setClientName={setClientName}
        setPostcode={setPostcode}
        setFilteredData={setDataToShow}
        setUpdateDataNeeded={() => {}}
        setShowEndedPosts={setShowEndedPosts}
        setShowNotEndedPosts={setShowNotEndedPosts}
      />

      <MuiDataGridForPostManagement
        dataArray={dataToShow}
        popUpOpen={popUpOpen}
        setPopUpOpen={setPopUpOpen}
        popUpOpenEdit={popUpOpenEdit}
        setPopUpOpenEdit={setPopUpOpenEdit}
        setFilteredData={setDataToShow}
        setUpdateDataNeeded={setUpdateDataNeeded}
      />

    </>
  );
}
