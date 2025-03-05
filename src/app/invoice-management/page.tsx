import React from "react";
import { SearchBox } from "./_components/search-box";
import ResultTable from "./_components/result-table";

function InvoiceManagementPage() {
  return (
    <>
      <SearchBox />
      <br/>
      <ResultTable />
    </>
  );
}

export default InvoiceManagementPage;
