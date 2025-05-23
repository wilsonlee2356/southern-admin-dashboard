"use client";
import { CheckIcon, TrashIcon } from "@/assets/icons";
import { PreviewIcon, EditIcon } from "@/components/Tables/icons";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";
import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import InvoiceUploadPopUp from "@/components/Layouts/Dialog/InvoicePopUp";
import InvoiceEditPopUp from "@/components/Layouts/Dialog/InvoiceEditPopUp";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { invoiceData } from "@/types/ObjectTypes/InvoiceType";
import { CombinedService } from "@/app/api/invoice";

type MuiDataGridWithPopUpButtonProps = {
  dataArray: (string | number)[][];
  popUpOpen: boolean;
  setPopUpOpen: any;
  popUpOpenEdit: boolean;
  setPopUpOpenEdit: any;
  setFilteredData: any;
};

function MuiDataGridForPostManagement({
  dataArray,
  popUpOpen,
  setPopUpOpen,
  popUpOpenEdit,
  setPopUpOpenEdit,
  setFilteredData,
}: MuiDataGridWithPopUpButtonProps) {
  const [selectedRows, setSelectedRows] = useState<(string | number)[][]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0
    //dataArray.reduce((sum: any, item: any) => sum + item.amount, 0),
  );
  const [canSetFinish, setCanSetFinish] = useState<boolean>(false);

  const [editingRow, setEditingRow] = useState<invoiceData>({} as invoiceData);

  // useEffect(() => {
  //   console.log("Data array updated:", dataArray);
  //   const total = dataArray.reduce(
  //     (sum: number, item: any) => sum + item.amount,
  //     0,
  //   );
  //   setTotalAmount(total);
  // }, [dataArray]);

  // useEffect(() => {
  //   console.log("Row selected:", editingRow);
  // }, [editingRow]);

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

  const updateSelectedRow = (checkedRows: GridRowSelectionModel) => {
    if (checkedRows.length === 0) {
      setSelectedRows([]);
      //setCanSetPay(false);
    } else {
      //console.log("Selected rows:", checkedRows);

      const checkedData = dataArray.filter((row: (string | number)[]) =>
        checkedRows.includes(row[3]),
      );

      // const total = checkedData.reduce(
      //   (sum: number, item: any) => sum + item.amount,
      //   0,
      // );

      const finishedInvoices = checkedData.filter(
        (row: any) => row[2] <= 0,
      );
      if (
        finishedInvoices.length === 0 ||
        checkedData.length > finishedInvoices.length
      ) {
        setCanSetFinish(true);
      } else {
        setCanSetFinish(false);
      }
      setSelectedRows(checkedData);
      // setTotalAmount(total);
    }
    
  };

  // const updateTotalAmount = (checkedRows: GridRowSelectionModel) => {
  //   if (checkedRows.length === 0) {
  //     setSelectedRows([]);
  //     setTotalAmount(
  //       dataArray.reduce((sum: number, item: any) => sum + item.amount, 0),
  //     );
  //     setCanSetPay(false);
  //   } else {
  //     //console.log("Selected rows:", checkedRows);

  //     const checkedData = dataArray.filter((row: any) =>
  //       checkedRows.includes(row.invoiceId),
  //     );

  //     const total = checkedData.reduce(
  //       (sum: number, item: any) => sum + item.amount,
  //       0,
  //     );

  //     const unPaidInvoices = checkedData.filter(
  //       (row: any) => row.settlementDate === null,
  //     );
  //     if (
  //       unPaidInvoices.length === 0 ||
  //       checkedData.length > unPaidInvoices.length
  //     ) {
  //       setCanSetPay(false);
  //     } else {
  //       setCanSetPay(true);
  //     }
  //     setSelectedRows(checkedData);
  //     setTotalAmount(total);
  //   }
  // };

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
      headerName: "id",
      valueGetter: (value, row) => row[3],
    },
    {
      field: "clientName",
      headerName: "Client Name",
      flex: 2,
      align: "center",
      headerAlign: "center",
      valueGetter: (value, row) => row[4],
      renderCell: (params) => (
        <h5 className="text-dark dark:text-white">{params.value}</h5>
      ),
    },
    {
      field: "Postcode",
      headerName: "Postcode",
      flex: 4,
      align: "center",
      headerAlign: "center",
      valueGetter: (value, row) => row[3],
      renderCell: (params) => (
        <h5 className="text-dark dark:text-white">{params.value}</h5>
      ),
    },
    {
      field: "NumberOfInvoices",
      headerName: "Number of invoices",
      flex: 2,
      align: "center",
      headerAlign: "center",
      valueGetter: (value, row) => row[0],
      renderCell: (params) => (
        <h5 className="text-dark dark:text-white">
          {params.value.toLocaleString()}
        </h5>
      ),
    },
    {
      field: "TotalAmount",
      headerName: "Total Amount",
      flex: 2,
      align: "center",
      headerAlign: "center",
      valueGetter: (value, row) => row[1],
      renderCell: (params) => (
        <h5 className="text-dark dark:text-white">{params.value}</h5>
      ),
    },
    {
      field: "Total Outstanding",
      headerName: "Total Outstanding",
      flex: 2,
      align: "center",
      headerAlign: "center",
      valueGetter: (value, row) => row[2],
      renderCell: (params) => (
        <h5 className="text-dark dark:text-white">{params.value}</h5>
      ),
    },
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   flex: 2.5,
    //   align: "center",
    //   headerAlign: "center",
    //   renderCell: (params) => (
    //     <div className="flex items-center justify-center gap-x-3.5">
    //       <button className="text-dark dark:text-white">
    //         <span className="sr-only">View Invoice</span>
    //         <PreviewIcon className="fill-dark dark:fill-white" />
    //       </button>
    //       <button className="text-dark dark:text-white"
    //         onClick={() => {
    //           // const invoice = getInvoiceById(params.id);
    //           // if (!invoice) return;
    //           // CombinedService.delete_invoice_by_id(invoice.invoiceId).then((res) => {
    //           //   console.log("Deleted invoice: ", res);
    //           //     const updatedData = dataArray.filter(
    //           //       (item) => item.invoiceId !== invoice.invoiceId,
    //           //     );
    //           //     setFilteredData(updatedData);
    //           // }
    //           // ).catch((err) => {
    //           //   console.log("Error deleting invoice: ", err);
    //           // });
              
    //         }}>
    //         <span className="sr-only">Delete Invoice</span>
    //         <TrashIcon className="fill-dark dark:fill-white" />
    //       </button>
    //       <button
    //         className="text-dark dark:text-white"
    //         onClick={() => {
    //           // const invoice = getInvoiceById(params.id);
    //           // if (!invoice) return;
    //           // setEditingRow(invoice);
    //           setPopUpOpenEdit(true);
    //         }}
    //       >
    //         <span className="sr-only">Edit Invoice</span>
    //         <EditIcon className="fill-dark dark:fill-white" />
    //       </button>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      {/* <ShowcaseSection
        title={`Total: $${totalAmount.toLocaleString()}`}
        className="!p-6.5"
      >
        <div></div>
      </ShowcaseSection> */}
      <div style={{ height: "auto", width: "100%", paddingBottom: "2rem" }}>
        <DataGrid
          rows={dataArray}
          columns={columns}
          getRowId={(row) => row[3]}
          columnVisibilityModel={{
            id: false,
          }}
          // isRowSelectable={(params: GridRowParams) => params.row.status === "Unpaid"}
          onRowSelectionModelChange={(checkedRows) => {
            updateSelectedRow(checkedRows);
          }}
          checkboxSelection
          disableColumnMenu
          disableRowSelectionOnClick
          hideFooter
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
              backgroundColor: "dark: black",
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
        disabled={!canSetFinish}
        onClick={() => {
          setPopUpOpen(true);
        }}
      />
      <InvoiceUploadPopUp
        title="Upload cheque or statement"
        open={popUpOpen}
        onClose={setPopUpOpen}
        dataArray={selectedRows}
        setDataArray={setFilteredData}
      />

      <InvoiceEditPopUp
        title="Edit invoice"
        open={popUpOpenEdit}
        onClose={setPopUpOpenEdit}
        invoiceInfo={editingRow}
        setDataArray={setFilteredData}
      />
    </div>
  );
}

export default MuiDataGridForPostManagement;
