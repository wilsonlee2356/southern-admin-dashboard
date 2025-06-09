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
import { invoiceData, post, postClientInvoiceSummary } from "@/types/ObjectTypes/InvoiceType";
import { CombinedService } from "@/app/api/invoice";
import ComfirmPopUp from "@/components/Layouts/Dialog/ComfirmPopUp";

type MuiDataGridWithPopUpButtonProps = {
  dataArray: invoiceData[];
  popUpOpen: boolean;
  setPopUpOpen: any;
  popUpOpenEdit: boolean;
  setPopUpOpenEdit: any;
  setFilteredData: any;
  setUpdateDataNeeded: any;
};

function MuiDataGridForPostManagement({
  dataArray,
  popUpOpen,
  setPopUpOpen,
  popUpOpenEdit,
  setPopUpOpenEdit,
  setFilteredData,
  setUpdateDataNeeded,
}: MuiDataGridWithPopUpButtonProps) {
  const [processedDataArray, setProcessedDataArray] = useState<postClientInvoiceSummary[]>([]);
  const [selectedRows, setSelectedRows] = useState<postClientInvoiceSummary[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0
    //dataArray.reduce((sum: any, item: any) => sum + item.amount, 0),
  );
  const [canSetFinish, setCanSetFinish] = useState<boolean>(false);

  const [editingRow, setEditingRow] = useState<postClientInvoiceSummary>({} as postClientInvoiceSummary);

  React.useEffect(() => {
      const processedArray : postClientInvoiceSummary[] = [];//
      dataArray.map((row: invoiceData) => {
        const existingPost = processedArray.find(
          (item) => item.post_id === row.post.postId,
        );
        if (existingPost) {
          existingPost.numberOfInvoices += 1;
          existingPost.totalAmount += row.amount;
          existingPost.outstanding += row.amount - row.paidAmount;
        } else {
          processedArray.push({
            post_id: row.post.postId,
            postcode: row.post.postcode,
            numberOfInvoices: 1,
            totalAmount: row.amount,
            outstanding: row.amount - row.paidAmount,
            ended: row.post.isEnded,
            client_name: row.post.client.clientName,
          });
        }
        
      });
      setProcessedDataArray(processedArray);
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

  const updateSelectedRow = (checkedRows: GridRowSelectionModel) => {
    if (checkedRows.length === 0) {
      setSelectedRows([]);
      //setCanSetPay(false);
    } else {
      //console.log("Selected rows:", checkedRows);

      const checkedData = processedDataArray.filter((row: postClientInvoiceSummary) =>
        checkedRows.includes(row.post_id),
      );
      //console.log("Checked data:1 ", checkedData);
      const finishedInvoices = checkedData.filter(
        (row: any) => row.ended === true,
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

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "id",
      valueGetter: (value, row) => row.post_id,
    },
    {
      field: "clientName",
      headerName: "Client Name",
      flex: 2,
      align: "center",
      headerAlign: "center",
      valueGetter: (value, row) => row.client_name,
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
      valueGetter: (value, row) => row.postcode,
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
      valueGetter: (value, row) => row.numberOfInvoices,
      renderCell: (params) => (
        <h5 className="text-dark dark:text-white">
          {params.value}
        </h5>
      ),
    },
    {
      field: "TotalAmount",
      headerName: "Total Amount",
      flex: 2,
      align: "center",
      headerAlign: "center",
      valueGetter: (value, row) => row.totalAmount === null ? 0 : row.totalAmount,
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
      valueGetter: (value, row) => row.outstanding === null ? 0 : row.outstanding,
      renderCell: (params) => (
        <h5 className="text-dark dark:text-white">{params.value}</h5>
      ),
    },
    {
          field: "isEnded",
          headerName: "Finished",
          flex: 2,
          align: "center",
          headerAlign: "center",
          valueGetter: (value, row) => row.ended,
          renderCell: (params) => (
            <div
              className={cn(
                "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium text-dark dark:text-white",
                {
                  "bg-[#219653]/[0.08]": params.value !== false,
                  "bg-[#D34053]/[0.08]": params.value === false,
                  //"bg-[#FFA70B]/[0.08]": params.value === "Pending",
                },
              )}
            >
              {params.value !== false ? "Paid" : "Unpaid"}
            </div>
          ),
        },
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
          rows={processedDataArray}
          columns={columns}
          getRowId={(row) => row.post_id}
          columnVisibilityModel={{
            id: false,
          }}
          // isRowSelectable={(params: GridRowParams) => params.row.status === "Unpaid"}
          rowSelectionModel={selectedRows.map((row) => row.post_id)}
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
        label="Set finished"
        variant="green"
        shape="full"
        size="default"
        icon={<CheckIcon className="fill-white" />}
        disabled={!canSetFinish}
        onClick={() => {
          setPopUpOpen(true);
        }}
      />
      <ComfirmPopUp
        title="Confirm"
        message="Are you sure you want to set the selected invoices as paid?"
        confirmButtonText="Set as paid"
        open={popUpOpen}
        onClose={setPopUpOpen}
        functionToRun={() => {
          // let idString = "";
          let idArr : number[] = [];
          //console.log("SelectedRow: ", selectedRows);
          selectedRows.map((row, index, array) => {
            idArr = [...idArr, row.post_id];
          });
          //console.log("idArr: "+idArr);
          
          CombinedService.set_post_to_finish(idArr).then((res) => {
          //console.log("Set post to finished: ", res);
            setUpdateDataNeeded(true);
            updateSelectedRow([]);
          }).catch((err) => {
            console.error("Error setting post to finished: ", err);
          });
          
        }}
      />
    </div>
  );
}

export default MuiDataGridForPostManagement;
