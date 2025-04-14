"use client";
import { CheckIcon, TrashIcon } from "@/assets/icons";
import { PreviewIcon, DownloadIcon, EditIcon } from "@/components/Tables/icons";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";
import { DataGrid, GridColDef, GridRowId, GridRowParams, GridRowSelectionModel } from "@mui/x-data-grid";
import InvoicePopUp from "@/components/Layouts/Dialog/InvoicePopUp";
import InvoiceEditPopUp from "@/components/Layouts/Dialog/InvoiceEditPopUp";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { invoiceData } from "@/types/ObjectTypes/InvoiceType";

type ResultTableProps = {
  dataArray: invoiceData[];
  popUpOpen: boolean;
  setPopUpOpen: any;
  popUpOpenEdit: boolean;
  setPopUpOpenEdit: any;
};


function ResultTable({ dataArray, popUpOpen, setPopUpOpen, popUpOpenEdit, setPopUpOpenEdit }: ResultTableProps) {

  const [selectedRows, setSelectedRows] = useState<invoiceData[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(dataArray.reduce(
    (sum: any, item: any) => sum + item.amount,
    0,
  ));
  const [canSetPay, setCanSetPay] = useState<boolean>(false);

  const [editingRow, setEditingRow] = useState<invoiceData | null>(null);

  useEffect(() => {
    const total = dataArray.reduce(
      (sum: number, item: any) => sum + item.amount,
      0,
    );
    setTotalAmount(total);
    console.log("Data array update:", dataArray);
  }, [dataArray]);
  
  if (!dataArray || dataArray.length === 0) {
    return (
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <ShowcaseSection title="No Data Available" className="!p-6.5">
          <p>No invoices found to display.</p>
        </ShowcaseSection>
      </div>
    );
  }

  // const totalAmount = dataArray.reduce(
  //   (sum: any, item: any) => sum + item.amount,
  //   0,
  // );

  const getInvoiceById = (id: GridRowId) => {
    //const idString = id.toString();
    const invoice = dataArray.find((item) => item.invoiceId === id);
    return invoice || null;
  }

  const updateTotalAmount = (checkedRows : GridRowSelectionModel) => {
      if (checkedRows.length === 0) {
        setSelectedRows([]);
        setTotalAmount(dataArray.reduce((sum: number, item: any) => sum + item.amount, 0));
        setCanSetPay(false);
      }else{
        console.log("Selected rows:", checkedRows);
        
        const checkedData = dataArray.filter((row: any) =>
          checkedRows.includes(row.invoiceId),
        );
        
        const total = checkedData.reduce(
          (sum: number, item: any) => sum + item.amount,
          0,
        );

        const unPaidInvoices = checkedData.filter((row: any) => row.status === "Unpaid");
        if (unPaidInvoices.length === 0 || checkedData.length > unPaidInvoices.length) {
          setCanSetPay(false);
        } else {
          setCanSetPay(true);
        }
        setSelectedRows(checkedData);
        setTotalAmount(total);
      }
  };
    
  //   const total = selectedData.reduce(
  //     (sum: number, item: any) => sum + item.amount,
  //     0,
  //   );
  //   setTotalAmount(total);
  // };

  // const handleSelectAll = (isChecked: boolean) => {
  //   if (isChecked) {
  //     setSelectedRows(dataArray.map((row: Invoice) => row.id));
  //   } else {
  //     setSelectedRows([]);
  //   }
  // };

  const columns: GridColDef[] = [
    // {
    //   field: "checkbox",
    //   headerName: "",
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    //   sortable: false,
    //   renderCell: (params) => (
    //     <Checkbox
    //       checked={selectedRows.includes(params.row.id)}
    //       onChange={(e) => {
    //         console.log("Checkbox clicked:", e.target.checked);
    //         setSelectedRows(
    //           e.target.checked
    //             ? [...selectedRows, params.row.id]
    //             : selectedRows.filter((id) => id !== params.row.id),
    //         );
    //         updateTotalAmount();
    //       }
          
            
    //       }
    //       className="text-dark dark:text-white"
    //     />
    //   ),
    //   renderHeader: () => (
    //     <Checkbox
    //       checked={selectedRows.length === dataArray.length}
    //       onChange={(e) => {handleSelectAll(e.target.checked);
    //                         updateTotalAmount();}}
    //       className="text-dark dark:text-white"
    //     />
    //   ),
    // },
    {
      field: "invoiceNum",
      headerName: "Invoice No.",
      flex: 2,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <h5 className="text-dark dark:text-white">{params.value}</h5>,
    },
    {
      field: "clienName",
      headerName: "Client name",
      flex: 2,
      align: "center",
      headerAlign: "center",
      valueGetter: (value, row) => row.post.client.clientName,
      renderCell: (params) => <h5 className="text-dark dark:text-white">{params.value}</h5>,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 2,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <h5 className="text-dark dark:text-white">{"$"+params.value.toLocaleString()}</h5>,
    },
    {
      field: "postCode",
      headerName: "Postcode",
      flex: 2,
      align: "center",
      headerAlign: "center",
      valueGetter: (value, row) => row.post.postcode,
      renderCell: (params) => <h5 className="text-dark dark:text-white">{params.value}</h5>,
    },
    {
      field: "createDate",
      headerName: "Invoice Date",
      flex: 2,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <p className="text-dark dark:text-white">
          {dayjs(params.value).format("MMM DD, YYYY")}
        </p>
      ),
    },
    {
      field: "settlementDate",
      headerName: "Status",
      flex: 2,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div
          className={cn(
            "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium text-dark dark:text-white",
            {
              "bg-[#219653]/[0.08]": params.value !== null,
              "bg-[#D34053]/[0.08]": params.value === null,
              //"bg-[#FFA70B]/[0.08]": params.value === "Pending",
            },
          )}
        >
          {params.value!== null ? "Paid" : "Unpaid"}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 2.5,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div className="flex items-center justify-center gap-x-3.5">
          <button className="text-dark dark:text-white">
            <span className="sr-only">View Invoice</span>
            <PreviewIcon className="fill-dark dark:fill-white" />
          </button>
          <button className="text-dark dark:text-white">
            <span className="sr-only">Delete Invoice</span>
            <TrashIcon className="fill-dark dark:fill-white" />
          </button>
          <button className="text-dark dark:text-white" onClick={() => 
                                                { const invoice = getInvoiceById(params.id);
                                                  setEditingRow(invoice);
                                                  setPopUpOpenEdit(true);

                                                }}>
            <span className="sr-only">Edit Invoice</span>
            <EditIcon className="fill-dark dark:fill-white" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <ShowcaseSection
        title={`Total: $${totalAmount.toLocaleString()}`}
        className="!p-6.5"
      >
        <div></div>
      </ShowcaseSection>
      <div style={{ height: "auto", width: "100%", paddingBottom: "2rem" }}>
        <DataGrid
          rows={dataArray}
          columns={columns}
          getRowId={(row) => row.invoiceId}
          // isRowSelectable={(params: GridRowParams) => params.row.status === "Unpaid"}
          onRowSelectionModelChange={(checkedRows) => { 
            updateTotalAmount(checkedRows);
          }}
          checkboxSelection
          disableColumnMenu
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            "& .MuiDataGrid-columnHeader": {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "dark: black"
            },
            
          }}

          
        />
      </div>
      <Button
        label="Set paid"
        variant="green"
        shape="full"
        size="default"
        icon={<CheckIcon className="fill-white" />}
        disabled={!canSetPay}
        onClick={() => {
            setPopUpOpen(true);
        }}
      />
      <InvoicePopUp
        title="Upload cheque or statement"
        open={popUpOpen}
        onClose={setPopUpOpen}
        dataArray={selectedRows} />
        
      <InvoiceEditPopUp
        title="Edit invoice"
        open={popUpOpenEdit}
        onClose={setPopUpOpenEdit}
        invoiceInfo={editingRow} />
    </div>
    

  );
}

export default ResultTable;
