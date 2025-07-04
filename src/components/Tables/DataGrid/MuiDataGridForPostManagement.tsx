"use client";
import { CheckIcon } from "@/assets/icons";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import {
  invoiceData,
  postClientInvoiceSummary,
} from "@/types/ObjectTypes/InvoiceType";
import { CombinedService } from "@/app/api/invoice";
import ComfirmPopUp from "@/components/Layouts/Dialog/ComfirmPopUp";
import { useSession } from "next-auth/react";
import { useAuthenticatedRequest } from "@/lib/auth";


type MuiDataGridWithPopUpButtonProps = {
  dataArray: invoiceData[];
  popUpOpen: boolean;
  setPopUpOpen: any;
  popUpOpenEdit: boolean;
  setPopUpOpenEdit: any;
  setFilteredData: any;
  setUpdateInvoiceData: any;
};

function MuiDataGridForPostManagement({
  dataArray,
  popUpOpen,
  setPopUpOpen,
  setUpdateInvoiceData,
}: MuiDataGridWithPopUpButtonProps) {
  const [processedDataArray, setProcessedDataArray] = useState<
    postClientInvoiceSummary[]
  >([]);
  const [selectedRows, setSelectedRows] = useState<postClientInvoiceSummary[]>(
    [],
  );
  const [canSetFinish, setCanSetFinish] = useState<boolean>(false);

  const { data: session, status } = useSession();

  const { makeAuthenticatedRequest } = useAuthenticatedRequest();

  React.useEffect(() => {
    const processedArray: postClientInvoiceSummary[] = []; //
    dataArray?.map((row: invoiceData) => {
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
    console.log("Processed data array: ", processedArray);
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

      const checkedData = processedDataArray.filter(
        (row: postClientInvoiceSummary) => checkedRows.includes(row.post_id),
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
        <h5 className="text-dark dark:text-white">{params.value}</h5>
      ),
    },
    {
      field: "TotalAmount",
      headerName: "Total Amount",
      flex: 2,
      align: "center",
      headerAlign: "center",
      valueGetter: (value, row) =>
        row.totalAmount === null ? 0 : row.totalAmount,
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
      valueGetter: (value, row) =>
        row.outstanding === null ? 0 : row.outstanding,
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
      <div style={{ height: "auto", width: "100%", paddingBottom: "2rem" }}>
        <DataGrid
          rows={processedDataArray}
          columns={columns}
          getRowId={(row) => row.post_id}
          columnVisibilityModel={{
            id: false,
          }}
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
      {status === "authenticated" &&
      session?.accessToken &&
      (session.role === "admins" || session.role === "editors") ? (
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
      ) : (
        <></>
      )}
      <ComfirmPopUp
        title="Confirm"
        message="Are you sure you want to set the selected invoices as paid?"
        confirmButtonText="Set as paid"
        open={popUpOpen}
        onClose={setPopUpOpen}
        functionToRun={() => {
          // let idString = "";
          let idArr: number[] = [];
          selectedRows.map((row) => {
            idArr = [...idArr, row.post_id];
          });

          CombinedService.set_post_to_finish(idArr, makeAuthenticatedRequest)
            .then(() => {
              setUpdateInvoiceData();
              updateSelectedRow([]);
            })
            .catch((err) => {
              console.error("Error setting post to finished: ", err);
            });
        }}
      />
    </div>
  );
}

export default MuiDataGridForPostManagement;
