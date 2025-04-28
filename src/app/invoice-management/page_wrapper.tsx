"use client";
import { useState, useEffect } from "react";
import SearchBox from "./_components/search-box";
import ResultTable from "./_components/result-table";
import { invoiceData } from "@/types/ObjectTypes/InvoiceType";
import MuiDataGridWithPopUpButton from "@/components/Tables/DataGrid/MuiDataGridWithPopUpButton";

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
    const selectedData = dataArray.filter((row: any) =>
      (
        (!checkEmpty(invoiceNumber) ? row.invoiceNum.includes(invoiceNumber) : true) && 
        (!checkEmpty(clientName) ? row.client.clientName.toLowerCase().includes(clientName.toLowerCase()) : true) && 
        (!checkEmpty(postcode) ? row.post.postcode.toLowerCase().includes(postcode.toLowerCase()) : true) && 
        (!checkEmpty(amount) ? /^\d+$/.test(amount) && row.amount.includes===amount : true) && 
        (!checkEmpty(period) ? checkDateWithinMonths(row.invoiceDate, parseInt(period)) : true)
      )
    );
    setFilteredData(selectedData);
  }, [invoiceNumber, clientName, postcode, amount, period]);

  useEffect(() => {
    console.log({ filteredData });
  }, [filteredData]);

  const checkEmpty = (value: string) => {
    return value === "" || value === undefined || value === null; 
  };

  const checkDateWithinMonths = (date: Date, months: number) => {
    const currentDate = new Date();
    const targetDate = new Date(date);
    targetDate.setMonth(targetDate.getMonth() + months);
    return currentDate <= targetDate;
  };

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
      <MuiDataGridWithPopUpButton
        dataArray={filteredData}
        popUpOpen={popUpOpen}
        setPopUpOpen={setPopUpOpen}
        popUpOpenEdit={popUpOpenEdit}
        setPopUpOpenEdit={setPopUpOpenEdit}
        setFilteredData={setFilteredData}
      />
    </>
  );
}
