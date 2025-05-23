"use client";
import { useState, useEffect } from "react";
import { InputBox } from "../client-management/_components/input-box";
import { client, post, invoiceData } from "@/types/ObjectTypes/InvoiceType";
import MuiDataGridWithPopUpButton from "@/components/Tables/DataGrid/MuiDataGridWithPopUpButton";
import PostSearchBox from "./_components/post-search-box";
import MuiDataGridForPostManagement from "@/components/Tables/DataGrid/MuiDataGridForPostManagement";

type PageWrapperProps = {
  dataArray: (string | number)[][]; // Pass data as a prop instead of fetching here
  clientData: client[];
  postData: post[];
};

export default function PageWrapper({ dataArray, clientData, postData }: PageWrapperProps) {
  const [dataToShow, setDataToShow] = useState<(string | number)[][]>([]);//0 = NumberOfInvoices, 1 = TotalAmount, 2 = TotalOutstandingAmount, 3 = postcode, 4 = clientName
//   const [invoiceNumber, setInvoiceNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [postcode, setPostcode] = useState("");
//   const [amount, setAmount] = useState("");
//   const [period, setPeriod] = useState("");
  const [popUpOpen, setPopUpOpen] = useState(false);
  const [popUpOpenEdit, setPopUpOpenEdit] = useState(false);

  useEffect(() => {
    console.log({ dataArray });
    setDataToShow(dataArray);
  }, [dataToShow]);

  useEffect(() => {
    const selectedData : (string | number)[][] = dataArray.filter((row: (string | number)[]) =>
      (
        (!checkEmpty(clientName) ? String(row[4]).toLowerCase().includes(clientName.toLowerCase()) : true) && 
        (!checkEmpty(postcode) ? String(row[3]).toLowerCase().includes(postcode.toLowerCase()) : true) 
        //&& (!checkEmpty(startDate) ? checkDateWithinMonths(row.invoiceDate, parseInt(startDate)) : true)
      )
    );
    setDataToShow(selectedData);
    console.log("Filtered post data: ", dataToShow);
    //console.log("Type ", selectedData = dataArray);
  }, [clientName, postcode, dataArray]);

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
        dataArray={dataArray}
        clientData={clientData}
        postData={postData}
        clientName={clientName}
        postcode={postcode}
        setClientName={setClientName}
        setPostcode={setPostcode}
        setFilteredData={setDataToShow}
        setUpdateDataNeeded={() => {}}
      />

      <MuiDataGridForPostManagement
        dataArray={dataToShow}
        popUpOpen={popUpOpen}
        setPopUpOpen={setPopUpOpen}
        popUpOpenEdit={popUpOpenEdit}
        setPopUpOpenEdit={setPopUpOpenEdit}
        setFilteredData={setDataToShow}
      />


    </>
  );
}
