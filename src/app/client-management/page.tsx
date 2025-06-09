import React from "react";
import { Suspense } from "react";
import { getInvoiceTableData } from "@/components/Tables/fetch";
import  InvoiceInputTable  from "@/components/FormElements/TableLists/InvoiceInputTable";
import { InvoiceService } from "../api/services/invoiceService";
import { CombinedService } from "@/app/api/invoice";
import PageWrapper from "./page_wrapper";

async function ClientManagementPage() {
  // const data = await InvoiceService.getAll();
  const data = await InvoiceService.getAll();
  const clientData = await CombinedService.get_all_client();
  const postData = await CombinedService.get_all_post();
  
  return (
    <>
        <div>
          <Suspense fallback={<div>Loading search form...</div>}>
            <PageWrapper dataArray={data} clientData={clientData} postData={postData} />
          </Suspense>
        </div>
        {/* <InputBox dataArray={data}/>
        <br />
        <InvoiceInputTable dataArray={data}/> */}
    </>
  );
}

export default ClientManagementPage;
