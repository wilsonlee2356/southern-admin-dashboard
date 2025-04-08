"use client";
import { CheckIcon, TrashIcon } from "@/assets/icons";
import { PreviewIcon, DownloadIcon } from "@/components/Tables/icons";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import InvoicePopUp from "@/components/Layouts/Dialog/InvoicePopUp";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { invoice } from "@/types/ObjectTypes/InvoiceType";

type ResultTableProps = {
  dataArray: invoice[];
  popUpOpen: boolean;
  setPopUpOpen: any;
};


function ResultTable({ dataArray, popUpOpen, setPopUpOpen }: ResultTableProps) {

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(dataArray.reduce(
    (sum: any, item: any) => sum + item.amount,
    0,
  ));

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



  const updateTotalAmount = (selectedRows : GridRowSelectionModel) => {
      if (selectedRows.length === 0) {
        setTotalAmount(dataArray.reduce((sum: number, item: any) => sum + item.amount, 0));
      }else{
        console.log("Selected rows:", selectedRows);
        setSelectedRows(selectedRows as string[]);
        const selectedData = dataArray.filter((row: any) =>
          selectedRows.includes(row.id),
        );
        const total = selectedData.reduce(
          (sum: number, item: any) => sum + item.amount,
          0,
        );
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
      field: "id",
      headerName: "Invoice No.",
      flex: 2,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <h5 className="text-dark dark:text-white">{params.value}</h5>,
    },
    {
      field: "name",
      headerName: "Client name",
      flex: 2,
      align: "center",
      headerAlign: "center",
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
      field: "postcode",
      headerName: "Postcode",
      flex: 2,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <h5 className="text-dark dark:text-white">{params.value}</h5>,
    },
    {
      field: "date",
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
      field: "status",
      headerName: "Status",
      flex: 2,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div
          className={cn(
            "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium text-dark dark:text-white",
            {
              "bg-[#219653]/[0.08]": params.value === "Paid",
              "bg-[#D34053]/[0.08]": params.value === "Unpaid",
              "bg-[#FFA70B]/[0.08]": params.value === "Pending",
            },
          )}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 2.5,
      align: "center",
      headerAlign: "center",
      renderCell: () => (
        <div className="flex items-center justify-center gap-x-3.5">
          <button className="text-dark dark:text-white">
            <span className="sr-only">View Invoice</span>
            <PreviewIcon className="fill-dark dark:fill-white" />
          </button>
          <button className="text-dark dark:text-white">
            <span className="sr-only">Delete Invoice</span>
            <TrashIcon className="fill-dark dark:fill-white" />
          </button>
          <button className="text-dark dark:text-white">
            <span className="sr-only">Download Invoice</span>
            <DownloadIcon className="fill-dark dark:fill-white" />
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
          onRowSelectionModelChange={(selectedRows) => { 
            updateTotalAmount(selectedRows);
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
        onClick={() => {
          setPopUpOpen(true);
        }}
      />
      <InvoicePopUp
      title="Upload cheque or statement"
      open={popUpOpen}
      onClose={setPopUpOpen} />
    </div>
    

  );
}

export default ResultTable;
