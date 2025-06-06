"use client";
import { useState, useEffect } from "react";
import { InputBox } from "../client-management/_components/input-box";
import { client, post, invoiceData, postClientInvoiceSummary } from "@/types/ObjectTypes/InvoiceType";
import MuiDataGridWithPopUpButton from "@/components/Tables/DataGrid/MuiDataGridWithPopUpButton";
import PostSearchBox from "./_components/post-search-box";
import { InvoiceService } from "../api/services/invoiceService";
import { CombinedService } from "@/app/api/invoice";
import MuiDataGridForPostManagement from "@/components/Tables/DataGrid/MuiDataGridForPostManagement";

type PageWrapperProps = {
  dataArray: postClientInvoiceSummary[]; // Pass data as a prop instead of fetching here
  clientData: client[];
  postData: post[];
};

export default function PageWrapper({ dataArray, clientData, postData }: PageWrapperProps) {
  const [dataToShow, setDataToShow] = useState<postClientInvoiceSummary[]>([]);//0 = NumberOfInvoices, 1 = TotalAmount, 2 = TotalOutstandingAmount, 3 = post_id, 4 = postcode, 5 = is_ended, 6 = clientName
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
    
    const selectedData : postClientInvoiceSummary[] = dataArray.filter((row: postClientInvoiceSummary) =>
      (
        (!checkEmpty(clientName) ? row.client_name.toLowerCase().includes(clientName.toLowerCase()) : true) && 
        (!checkEmpty(postcode) ? row.postcode.toLowerCase().includes(postcode.toLowerCase()) : true) &&
        (showNotEndedPosts && !row.ended) ||
        (showEndedPosts && row.ended)
        
        //&& (!checkEmpty(startDate) ? checkDateWithinMonths(row.invoiceDate, parseInt(startDate)) : true)
      )
    );
    setDataToShow(selectedData);
    console.log("Filtered post data: ", selectedData);
    //console.log("Type ", selectedData = dataArray);
  }, [clientName, postcode, showNotEndedPosts, showEndedPosts, dataArray, updateDataNeeded]);

  useEffect(() => {
      if(updateDataNeeded){
        
        CombinedService.get_post_client_invoice_summry().then((res) => {
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
