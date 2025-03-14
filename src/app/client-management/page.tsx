import React from "react";
import { InputBox } from "../client-management/_components/input-box";
import ResultTable from "./_components/new-input-table";

function ClientManagementPage() {
  return (
    <>
      <InputBox />
      <br />
      <ResultTable />
    </>
  );
}

export default ClientManagementPage;
