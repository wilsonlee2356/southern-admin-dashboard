"use client";
import { CheckIcon } from "@/assets/icons";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";
import { PreviewIcon, EditIcon } from "@/components/Tables/icons";
import { DataGrid, GridColDef, GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import {
  post,
  postClientInvoiceSummary,
} from "@/types/ObjectTypes/InvoiceType";
import { CombinedService } from "@/app/api/invoice";
import ComfirmPopUp from "@/components/Layouts/Dialog/ComfirmPopUp";
import { useSession } from "next-auth/react";
import { useAuthenticatedRequest } from "@/lib/auth";
import { usePostClientContent } from "@/utils/post-client-content";
import PostEditPopUp from "@/components/Layouts/Dialog/PostEditPopUp";
import { useAlert } from "@/utils/AlertProvider";


type MuiDataGridWithPopUpButtonProps = {
  dataArray: postClientInvoiceSummary[];
  postArray: post[];
  popUpOpen: boolean;
  setPopUpOpen: any;
  setFilteredData: any;
  // setUpdateInvoiceData: any;
};

function MuiDataGridForPostManagement({
  dataArray,
  postArray,
  popUpOpen,
  setPopUpOpen,
  // setUpdateInvoiceData,
}: MuiDataGridWithPopUpButtonProps) {
  // const [processedDataArray, setProcessedDataArray] = useState<
  //   postClientInvoiceSummary[]
  // >([]);
  const [selectedRows, setSelectedRows] = useState<postClientInvoiceSummary[]>(
    [],
  );
  const [canSetFinish, setCanSetFinish] = useState<boolean>(false);

  const [canSetRestart, setCanSetRestart] = useState<boolean>(false);

  const [popUpOpenRestart, setPopUpOpenRestart] = useState(false);

  const [popUpOpenEdit, setPopUpOpenEdit] = useState(false);

  const [editingRow, setEditingRow] = useState<post>({} as post);

  const { data: session, status } = useSession();

  const { makeAuthenticatedRequest } = useAuthenticatedRequest();

  const { updateInvoiceData, updatePostData, loading } = usePostClientContent();

  const { addAlert } = useAlert();

  useEffect(() => {
    if(selectedRows.length==0){
      setCanSetRestart(false);
      setCanSetFinish(false);
      return;
    }
      setCanSetRestart(!selectedRows.some((selectedRow) => !selectedRow.ended));
      setCanSetFinish(!selectedRows.some((selectedRow) => selectedRow.ended));
    }, [selectedRows]);

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
      setCanSetRestart(false);
      setCanSetFinish(false);
      //setCanSetPay(false);
    } else {
      //console.log("Selected rows:", checkedRows);
      const checkedData = dataArray.filter(
        (row: postClientInvoiceSummary) => checkedRows.includes(row.post_id),
      );
      console.log("Checked data: ", checkedData);
      // const finishedInvoices = checkedData.filter(
      //   (row: any) => row.ended === true,
      // );
      // const unFinishedInvoices = checkedData.filter(
      //   (row: any) => row.ended === false,
      // );
      // if(finishedInvoices.length === 0 && unFinishedInvoices.length > 0 && checkedData.length <= unFinishedInvoices.length) {
      //   setCanSetRestart(false);
      //   setCanSetFinish(true);
      // } else if (finishedInvoices.length > 0 && unFinishedInvoices.length === 0 && checkedData.length <= finishedInvoices.length) {
      //   setCanSetRestart(true);
      //   setCanSetFinish(false);
      // } else {
      //   setCanSetRestart(false);
      //   setCanSetFinish(false);
      // }
      setSelectedRows(checkedData);
      // setTotalAmount(total);
    }
  };

  const getPostById = (id: GridRowId) => {
      const post = postArray.find((item) => item.postId === id);
      return post;
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
          {params.value !== false ? "Finished" : "Unfinished"}
        </div>
      ),
    },
    {
          field: "actions",
          headerName: "Actions",
          flex: 1,
          align: "center",
          headerAlign: "center",
          renderCell: (params) => (
            <div className="flex items-center justify-center gap-x-3.5">
              
              {(status === "authenticated" && session?.accessToken && (session.role === 'admins' || session.role === 'editors')) ?
              <>
              <button
                className="text-dark dark:text-white"
                onClick={() => {
                  const post = getPostById(params.id);
                  if (!post) return;
                  setEditingRow(post);
                  setPopUpOpenEdit(true);
                }}
              >
                <span className="sr-only">Edit Invoice</span>
                <EditIcon className="fill-dark dark:fill-white" />
              </button>
              </> : <></>}
            </div>
          ),
        },
  ];

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div style={{ height: "auto", 
          maxHeight: "400px", 
          width: "100%", 
          paddingBottom: "2rem",
          display: "flex",
          flexDirection: "column"  }}>
        <DataGrid
          rows={dataArray}
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
          loading={loading}
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
          slotProps={{
            loadingOverlay: {
              variant: 'skeleton',
              noRowsVariant: 'skeleton',
            },
          }}
        />
      </div>
      {status === "authenticated" &&
      session?.accessToken &&
      (session.role === "admins" || session.role === "editors") ? (
        <div className="flex items-center justify-start gap-2">
          <Button
            label="Finish"
            variant="green"
            shape="full"
            size="default"
            icon={<CheckIcon className="fill-white" />}
            disabled={!canSetFinish}
            onClick={() => {
              setPopUpOpen(true);
            }}
          />
          <Button
            label="Restart"
            variant="blue"
            shape="full"
            size="default"
            icon={<CheckIcon className="fill-white" />}
            disabled={!canSetRestart}
            onClick={() => {
              setPopUpOpenRestart(true);
            }}
          />
        </div>
      ) : (
        <></>
      )}
      <ComfirmPopUp
        title="Confirm"
        message="Are you sure you want to set the selected post as ended?"
        confirmButtonText="Sure"
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
              updateInvoiceData();
              updatePostData();
              updateSelectedRow([]);
            })
            .catch((err) => {
              
              console.error("Error setting post to finished: ", err);
              addAlert(String(err), 'error', 10000);
            });
        }}
      />

      <PostEditPopUp
        postToEdit={editingRow}
        open={popUpOpenEdit}
        onClose={setPopUpOpenEdit}
        updatePostData={updatePostData} />

      <ComfirmPopUp
        title="Confirm"
        message="Are you sure you want to reset the ended posts?"
        confirmButtonText="Sure"
        open={popUpOpenRestart}
        onClose={setPopUpOpenRestart}
        functionToRun={() => {
          // let idString = "";
          let idArr: number[] = [];
          selectedRows.map((row) => {
            idArr = [...idArr, row.post_id];
          });

          CombinedService.set_post_to_restart(idArr, makeAuthenticatedRequest)
            .then(() => {
              updateInvoiceData();
              updatePostData();
              updateSelectedRow([]);
            })
            .catch((err) => {
              
              console.error("Error setting post to finished: ", err);
              addAlert(String(err), 'error', 10000);
            });
        }}
      />
    </div>
  );
}

export default MuiDataGridForPostManagement;
