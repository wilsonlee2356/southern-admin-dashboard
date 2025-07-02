"use client";
import { UploadIcon } from "@/assets/icons";
import { PreviewIcon, DisabledPreviewIcon } from "@/components/Tables/icons";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useRef } from "react";
import { Button } from "@heroui/react";
import { fileToBase64String } from "@/utils/file-reader";
import { invoiceCheques } from "@/types/ObjectTypes/InvoiceType";

type ChequeEditMuiDataGridProps = {
  dataArray: invoiceCheques[];
  setImageSrcToView: any;
  onClose: any;
  setChequeCopy: any;
};


function ChequeEditMuiDataGrid({ dataArray, setImageSrcToView, onClose, setChequeCopy }: ChequeEditMuiDataGridProps) {

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!dataArray || dataArray.length === 0) {
    return (
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <ShowcaseSection title="No Data Available" className="!p-6.5">
          <p>No invoices found to display.</p>
        </ShowcaseSection>
      </div>
    );
  }

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "id",
      valueGetter: (value, row) => (row.invoice.invoiceId + "-" + row.cheque.chequeId),
    },
    {
          field: "PaymentDate",
          headerName: "Payment Date",
          flex: 2,
          align: "center",
          headerAlign: "center",
          valueGetter: (value, row) => row.paymentDate,
          renderCell: (params) => <h5 className="text-dark dark:text-white">{params.value}</h5>,
    },
    {
          field: "Amount",
          headerName: "Amount",
          flex: 2,
          align: "center",
          headerAlign: "center",
          valueGetter: (value, row) => row.amount,
          renderCell: (params) => <h5 className="text-dark dark:text-white">{params.value}</h5>,
    },
    {
          field: "View Cheque",
          headerName: "View Cheque",
          flex: 1,
          align: "center",
          headerAlign: "center",
          valueGetter: (value, row) => row.cheque,
          renderCell: (params) => (
            <div className="flex items-center justify-center gap-x-3.5">
                
              {(params.value.chequeCopy) ? <button className="text-dark dark:text-white"
                    type="button"
                    onClick={() => {
                        if(params.value){
                        console.log("View Cheque clicked for cheque copy:", params.value.chequeCopy);
                        setImageSrcToView(params.value.chequeCopy);
                        onClose(true);
                        }
                    }}
                >
                <span className="sr-only">View Cheque copy</span>
                { (!params.value.chequeCopy) ? 
                    <DisabledPreviewIcon className="fill-grey dark:fill-grey"/> :
                    <PreviewIcon className="fill-dark dark:fill-white"/>}
              </button> : 
              <>
              <Button className="text-dark dark:text-white"
                    type="button"
                    isIconOnly
                    onPress={() => 
                        fileInputRef.current?.click()
                    }
                >
                <span className="sr-only">Upload Cheque copy</span>
                <UploadIcon className="fill-dark dark:fill-white"/>
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    if (event.target.files && event.target.files.length > 0) {
                        console.log("Cheque file selected:", event.target.files);
                        // setChequeFile(e.target.files ? e.target.files[0] : undefined);
                        fileToBase64String(event.target.files ? event.target.files[0] : new Blob()).then((base64String) => {
                            console.log("Cheque file base64 string:", base64String);
                            setChequeCopy(params.value.chequeId, base64String);
                            console.log("Cheque file:", base64String);
                        }).catch((error) => {
                            console.error("Error converting file to base64:", error);
                        });
                    }
                }}
                style={{ display: 'none' }} // Hide the native input
                /></>}
            </div>
          ),
    },

  ];

  return (
      <div style={{ height: "auto", width: "100%" }}>
        <DataGrid
          rows={dataArray}
          columns={columns}
          getRowId={(row) => row.cheque.chequeId}
          columnVisibilityModel={{
            id: false,
          }}
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
              backgroundColor: "dark: black"
            },
            
          }}

          
        />
      </div>
    

  );
}

export default ChequeEditMuiDataGrid;
