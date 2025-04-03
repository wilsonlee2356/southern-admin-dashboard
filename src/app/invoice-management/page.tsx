// app/invoices/page.tsx
import { Suspense } from "react";
import { getInvoiceTableData } from "@/components/Tables/fetch";
import PageWrapper from "./page_wrapper";
import SearchBox from "./_components/search-box";
import ResultTable from "./_components/result-table";

export default async function InvoicesPage() {
  const dataArray = await getInvoiceTableData();

  return (
    <div>
      <Suspense fallback={<div>Loading search form...</div>}>
        <PageWrapper dataArray={dataArray}/>
        {/* <SearchBox dataArray={dataArray} />
        <ResultTable dataArray={dataArray} /> */}
      </Suspense>
    </div>
  );
}
