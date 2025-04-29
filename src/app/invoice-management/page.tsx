// app/invoices/page.tsx
import { Suspense } from "react";
import PageWrapper from "./page_wrapper";
import { InvoiceService } from "../api/services/invoiceService";
import { CombinedService } from "@/app/api/invoice";

export default async function InvoicesPage() {
  const dataArrayTesting = await InvoiceService.getAll();

  const clientData = await CombinedService.get_all_client();
  const postData = await CombinedService.get_all_post();

  return (
    <div>
      <Suspense fallback={<div>Loading search form...</div>}>
        <PageWrapper dataArray={dataArrayTesting} clientData={clientData} postData={postData} />
        {/* <SearchBox dataArray={dataArray} />
        <ResultTable dataArray={dataArray} /> */}
      </Suspense>
    </div>
  );
}
