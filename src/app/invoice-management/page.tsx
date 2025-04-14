// app/invoices/page.tsx
import { Suspense } from "react";
import PageWrapper from "./page_wrapper";
import { InvoiceService } from "../api/services/invoiceService";

export default async function InvoicesPage() {
  const dataArrayTesting = await InvoiceService.getAll();

  return (
    <div>
      <Suspense fallback={<div>Loading search form...</div>}>
        <PageWrapper dataArray={dataArrayTesting} />
        {/* <SearchBox dataArray={dataArray} />
        <ResultTable dataArray={dataArray} /> */}
      </Suspense>
    </div>
  );
}
