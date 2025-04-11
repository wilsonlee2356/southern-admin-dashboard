// app/invoices/page.tsx
import { Suspense } from "react";
import { getInvoiceTableData } from "@/components/Tables/fetch";
import PageWrapper from "./page_wrapper";
import SearchBox from "./_components/search-box";
import ResultTable from "./_components/result-table";
import { GET_ALL_INVOICES } from "@/app/api/invoice";

export default async function InvoicesPage() {
  const dataArray = await getInvoiceTableData();

  const dataArrayTesting = await GET_ALL_INVOICES();
  console.log("Get Data Array: ", dataArrayTesting);

  return (
    <div>
      <Suspense fallback={<div>Loading search form...</div>}>
        <PageWrapper dataArray={dataArrayTesting}/>
        {/* <SearchBox dataArray={dataArray} />
        <ResultTable dataArray={dataArray} /> */}
      </Suspense>
    </div>
  );
}
