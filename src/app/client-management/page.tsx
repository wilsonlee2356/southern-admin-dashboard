import React from "react";
import { Suspense } from "react";
import { InputBox } from "../client-management/_components/input-box";
import ResultTable from "./_components/new-input-table";
import { getInvoiceTableData } from "@/components/Tables/fetch";
import  InvoiceInputTable  from "@/components/FormElements/TableLists/InvoiceInputTable";
import { InvoiceService } from "../api/services/invoiceService";
import PageWrapper from "./page_wrapper";

async function ClientManagementPage() {
  const data = await await InvoiceService.getAll();
  return (
    <>
        <div>
          <Suspense fallback={<div>Loading search form...</div>}>
            <PageWrapper dataArray={data} />
          </Suspense>
        </div>
        {/* <InputBox dataArray={data}/>
        <br />
        <InvoiceInputTable dataArray={data}/> */}
    </>
  );
}

export default ClientManagementPage;
