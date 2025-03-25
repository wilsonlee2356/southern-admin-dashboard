import React from "react";
import { SearchBox } from "./_components/search-box";
import ResultTable from "./_components/result-table";
import { getInvoiceTableData } from "@/components/Tables/fetch";

async function InvoiceManagementPage() {
  const data = await getInvoiceTableData();
  return (
    <>
      <SearchBox dataArray={data} />
      <br/>
      <ResultTable />
    </>
  );
}

export default InvoiceManagementPage;
