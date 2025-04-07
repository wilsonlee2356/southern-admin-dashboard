"use client";
import { Suspense, useState, useEffect } from "react";
import { getInvoiceTableData } from "@/components/Tables/fetch";
import SearchBox from "./_components/search-box";
import ResultTable from "./_components/result-table";
import { invoice } from "@/types/ObjectTypes/InvoiceType";

type PageWrapperProps = {
    dataArray: invoice[]; // Pass data as a prop instead of fetching here
  };

export default function PageWrapper({ dataArray }: PageWrapperProps) {
    const [filteredData, setFilteredData] = useState(dataArray);
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [clientName, setClientName] = useState("");
    const [postcode, setPostcode] = useState("");
    const [amount, setAmount] = useState("");
    const [period, setPeriod] = useState("");
    

    // useEffect(() => {
    //     console.log({ 
    //         invoiceNumber, 
    //         clientName, postcode, amount, period });
    //     return () => {
    //     };
    //   }, [invoiceNumber, clientName, postcode, amount, period]);

    return (
    <>
        <SearchBox dataArray={dataArray} invoiceNumber={invoiceNumber} clientName={clientName}
                    postcode={postcode} amount={amount} period={period}
                    setInvoiceNumber={setInvoiceNumber}
                    setClientName={setClientName} setPostcode={setPostcode}
                    setAmount={setAmount} setPeriod={setPeriod} setFilteredData={setFilteredData}/>
        <ResultTable dataArray={filteredData} />
    </>
    );
}