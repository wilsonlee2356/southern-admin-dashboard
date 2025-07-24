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


type MuiDataGridProps = {
    columns: GridColDef[];
    rowdata: any;
    identifyRowId: any;
    columnVisible: any;
    hasCheckBoxes?: boolean;
    isDataLoading?: boolean;
};

function MuiDataGrid({  
    columns,
    rowdata,
    identifyRowId,
    columnVisible,
    hasCheckBoxes = false,
    isDataLoading = false,
  // setUpdateInvoiceData,
}: MuiDataGridProps) {
  // const [processedDataArray, setProcessedDataArray] = useState<
  //   postClientInvoiceSummary[]
  // >([]);
//   const [selectedRows, setSelectedRows] = useState<postClientInvoiceSummary[]>(
//     [],
//   );
//   const [canSetFinish, setCanSetFinish] = useState<boolean>(false);

//   const [canSetRestart, setCanSetRestart] = useState<boolean>(false);

//   const [popUpOpenRestart, setPopUpOpenRestart] = useState(false);

//   const [popUpOpenEdit, setPopUpOpenEdit] = useState(false);

//   const [editingRow, setEditingRow] = useState<post>({} as post);

//   const { data: session, status } = useSession();

//   const { makeAuthenticatedRequest } = useAuthenticatedRequest();

//   const { updateInvoiceData, updatePostData, loading } = usePostClientContent();

//   const { addAlert } = useAlert();

//   useEffect(() => {
//     if(selectedRows.length==0){
//       setCanSetRestart(false);
//       setCanSetFinish(false);
//       return;
//     }
//       setCanSetRestart(!selectedRows.some((selectedRow) => !selectedRow.ended));
//       setCanSetFinish(!selectedRows.some((selectedRow) => selectedRow.ended));
//     }, [selectedRows]);

//   if (!dataArray || dataArray.length === 0) {
//     return (
//       <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
//         <ShowcaseSection title="No Data Available" className="!p-6.5">
//           <p>No invoices found to display.</p>
//         </ShowcaseSection>
//       </div>
//     );
//   }

//   const updateSelectedRow = (checkedRows: GridRowSelectionModel) => {
//     if (checkedRows.length === 0) {
//       setSelectedRows([]);
//       setCanSetRestart(false);
//       setCanSetFinish(false);
//       //setCanSetPay(false);
//     } else {
//       //console.log("Selected rows:", checkedRows);
//       const checkedData = dataArray.filter(
//         (row: postClientInvoiceSummary) => checkedRows.includes(row.post_id),
//       );
//       console.log("Checked data: ", checkedData);
//       // const finishedInvoices = checkedData.filter(
//       //   (row: any) => row.ended === true,
//       // );
//       // const unFinishedInvoices = checkedData.filter(
//       //   (row: any) => row.ended === false,
//       // );
//       // if(finishedInvoices.length === 0 && unFinishedInvoices.length > 0 && checkedData.length <= unFinishedInvoices.length) {
//       //   setCanSetRestart(false);
//       //   setCanSetFinish(true);
//       // } else if (finishedInvoices.length > 0 && unFinishedInvoices.length === 0 && checkedData.length <= finishedInvoices.length) {
//       //   setCanSetRestart(true);
//       //   setCanSetFinish(false);
//       // } else {
//       //   setCanSetRestart(false);
//       //   setCanSetFinish(false);
//       // }
//       setSelectedRows(checkedData);
//       // setTotalAmount(total);
//     }
//   };



//   const columns: GridColDef[] 

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div style={{ height: "auto", 
          maxHeight: "400px", 
          width: "100%", 
          paddingBottom: "2rem",
          display: "flex",
          flexDirection: "column"  }}>
        <DataGrid
          rows={rowdata}
          columns={columns}
          getRowId={identifyRowId}
          columnVisibilityModel={columnVisible}
        //   rowSelectionModel={selectedRows.map((row) => row.post_id)}
        //   onRowSelectionModelChange={(checkedRows) => {
        //     updateSelectedRow(checkedRows);
        //   }}
          checkboxSelection={hasCheckBoxes}
          disableColumnMenu
          disableRowSelectionOnClick
          hideFooter
          loading={isDataLoading}
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
      
    </div>
  );
}

export default MuiDataGrid;
