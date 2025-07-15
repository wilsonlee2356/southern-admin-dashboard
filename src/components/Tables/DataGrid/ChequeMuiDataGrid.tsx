"use client";
import { CheckIcon, TrashIcon } from "@/assets/icons";
import { PreviewIcon, DisabledPreviewIcon } from "@/components/Tables/icons";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import { invoiceCheques } from "@/types/ObjectTypes/InvoiceType";

type ChequeMuiDataGridProps = {
  dataArray: invoiceCheques[];
  setImageSrcToView: any;
  onClose: any;
  loadingCheques: boolean;
};


function ChequeMuiDataGrid({ dataArray, setImageSrcToView, onClose, loadingCheques }: ChequeMuiDataGridProps) {

  if (!loadingCheques && (!dataArray || dataArray.length === 0)) {
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
          valueGetter: (value, row) => row.cheque.base64StringChequeCopy,
          renderCell: (params) => (
            <div className="flex items-center justify-center gap-x-3.5">
              <button className="text-dark dark:text-white"
                  onClick={() => {
                    // const invoice = getInvoiceById(params.id);
                    // if (!invoice) return;
                    // setEditingRow(invoice);
                    // setPopUpOpenView(true);
                    if(params.value){
                      console.log("View Cheque clicked for cheque copy:", params.value);
                      setImageSrcToView(params.value);
                      onClose(true);
                    }
                    
                  }}
                >
                <span className="sr-only">View Invoice</span>
                { (!params.value) ? 
                    <DisabledPreviewIcon className="fill-grey dark:fill-grey"/> :
                    <PreviewIcon className="fill-dark dark:fill-white"/>}
              </button>
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
          loading={loadingCheques}
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
          slotProps={{
            loadingOverlay: {
              variant: 'skeleton',
              noRowsVariant: 'skeleton',
            },
          }}
          
        />
      </div>
    

  );
}

export default ChequeMuiDataGrid;
