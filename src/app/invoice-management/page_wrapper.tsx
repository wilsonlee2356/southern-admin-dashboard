"use client";
import { useState, useEffect } from "react";
import SearchBox from "./_components/search-box";
import ResultTable from "./_components/result-table";
import { invoiceData } from "@/types/ObjectTypes/InvoiceType";

type PageWrapperProps = {
  dataArray: any[]; // Pass data as a prop instead of fetching here
};

export default function PageWrapper({ dataArray }: PageWrapperProps) {
  const [filteredData, setFilteredData] = useState<invoiceData[]>(dataArray);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState("");
  const [popUpOpen, setPopUpOpen] = useState(false);
  const [popUpOpenEdit, setPopUpOpenEdit] = useState(false);

  useEffect(() => {
    console.log({ filteredData });
  }, [filteredData]);

  return (
    <>
      <SearchBox
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
      />
      <ResultTable
        dataArray={filteredData}
        popUpOpen={popUpOpen}
        setPopUpOpen={setPopUpOpen}
        popUpOpenEdit={popUpOpenEdit}
        setPopUpOpenEdit={setPopUpOpenEdit}
      />
    </>
  );
}
