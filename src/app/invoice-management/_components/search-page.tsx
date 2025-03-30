"use client";

import React, { useState, useEffect } from "react";
import { SearchBox } from "./search-box";
import ResultTable from "./result-table";
import { invoice, invoiceArray } from "@/types/ObjectTypes/InvoiceType";


export const InvoiceSearchPage = ({ dataArray } : invoiceArray) => {
    const [invoiceNum, setInvoiceNumber] = useState("");
    const [clientName, setClientName] = useState("");
    const [postcode, setPostcode] = useState("");
    const [amount, setAmount] = useState(0);
    const [period, setPeriod] = useState(0);

    useEffect(() => {
        console.log("Invoice Number: ", invoiceNum);
      }, [invoiceNum]);
    return (
        <>
            <SearchBox dataArray={dataArray} updateInvoiceNumber={"invoiceNum"} 
                updateClientName={setClientName} updatePostcode={setPostcode} 
                updateAmount={setAmount} updatePeriod={setPeriod} />
            <br/>
            <ResultTable />
        </>
    );
}

export default InvoiceSearchPage;