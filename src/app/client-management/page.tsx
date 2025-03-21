import React from "react";
import { InputBox } from "../client-management/_components/input-box";
import ResultTable from "./_components/new-input-table";
import { getInvoiceTableData } from "@/components/Tables/fetch";
import  TableListOne  from "@/components/FormElements/TableLists/TableListOne";

async function ClientManagementPage() {
  const data = await getInvoiceTableData();
  return (
    <>
      <InputBox dataArray={data}/>
      <br />
      <TableListOne dataArray={data}/>
    </>
  );
}

export default ClientManagementPage;
