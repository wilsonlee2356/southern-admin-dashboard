"use client";
import { useState, useEffect } from "react";
import { InputBox } from "../client-management/_components/input-box";
import { client, post, invoiceData } from "@/types/ObjectTypes/InvoiceType";
import MuiDataGridWithPopUpButton from "@/components/Tables/DataGrid/MuiDataGridWithPopUpButton";

type PageWrapperProps = {
  dataArray: any[]; // Pass data as a prop instead of fetching here
  clientData: client[];
  postData: post[];
};

export default function PageWrapper({ dataArray, clientData, postData }: PageWrapperProps) {
  const [dataToShow, setDataToShow] = useState<invoiceData[]>([]);
//   const [invoiceNumber, setInvoiceNumber] = useState("");
//   const [clientName, setClientName] = useState("");
//   const [postcode, setPostcode] = useState("");
//   const [amount, setAmount] = useState("");
//   const [period, setPeriod] = useState("");
  const [popUpOpen, setPopUpOpen] = useState(false);
  const [popUpOpenEdit, setPopUpOpenEdit] = useState(false);

  useEffect(() => {
    console.log({ dataToShow });
  }, [dataToShow]);

  return (
    <>
      <InputBox dataArray={dataArray} clientData={clientData} postData={postData} setDataToShow={setDataToShow}/>
      {/* <SearchBox
        dataArray={dataArray}
        invoiceNumber={invoiceNumber}
        clientName={clientName}
        postcode={postcode}
        amount={amount}
        period={period}
        setInvoiceNumber={setInvoiceNumber}
        setClientName={setClientName}
        setPostcode={setPostcode}
        setAmount={setAmount}
        setPeriod={setPeriod}
        setFilteredData={setFilteredData}
      /> */}
      <MuiDataGridWithPopUpButton
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
