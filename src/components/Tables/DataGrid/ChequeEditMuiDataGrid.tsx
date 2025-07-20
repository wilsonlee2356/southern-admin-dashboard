"use client";
import { UploadIcon } from "@/assets/icons";
import { PreviewIcon, DisabledPreviewIcon } from "@/components/Tables/icons";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useRef } from "react";
import { Button } from "@heroui/react";
import { fileToBase64String } from "@/utils/file-reader";
import { InvoiceCheques, cheque } from "@/types/ObjectTypes/InvoiceType";
import { CombinedService } from "@/app/api/invoice";
import { useAuthenticatedRequest } from "@/lib/auth";
import { useAlert } from "@/utils/AlertProvider";

type ChequeEditMuiDataGridProps = {
  dataArray: any;
  setImageSrcToView: any;
  windowOpen: boolean;
  dataGridLoaded: boolean;
  onClose: any;
  setChequeCopy: any;
  loadingInvoiceCheques: boolean;
  setLoadingCheques: any;
  setDataGridLoaded: any;
};

function ChequeEditMuiDataGrid({
  dataArray,
  setImageSrcToView,
  windowOpen,
  dataGridLoaded,
  onClose,
  setChequeCopy,
  loadingInvoiceCheques,
  setLoadingCheques,
  setDataGridLoaded,
}: ChequeEditMuiDataGridProps) {
  const [invoiceCheques, setInvoiceCheques] =
    React.useState<InvoiceCheques[]>(dataArray);
  const [loadedChequesNumber, setLoadedChequesNumber] =
    React.useState<number>(0);
  const [chequesOfThisInvoice, setChequeOfThisInvoice] = React.useState<
    cheque[]
  >([]);

  const { makeAuthenticatedRequest } = useAuthenticatedRequest();

  const { addAlert } = useAlert();

  useEffect(() => {
    console.log("Initial cheque data: ", dataArray);
    setInvoiceCheques(dataArray);
    console.log("Is datagrid loaded", dataGridLoaded);

    if (!windowOpen) {
      setDataGridLoaded(false);
      setLoadingCheques(false);
      setLoadedChequesNumber(0);
      setInvoiceCheques([]);
      console.log("Is datagrid loaded", dataGridLoaded, windowOpen);
    }

    if (dataArray?.length > 0 && windowOpen && !dataGridLoaded) {
      // setLoadingCheques(true);
      setLoadedChequesNumber(dataArray.length);
      setDataGridLoaded(true);
      const chequesOfTheCurrentInvoice: cheque[] = dataArray.map(
        (invoiceCheque: InvoiceCheques) => {
          return invoiceCheque.cheque;
        },
      );
      setChequeOfThisInvoice(chequesOfTheCurrentInvoice);

      dataArray.forEach((item: any) => {
        CombinedService.get_cheque_by_id(
          item.cheque.chequeId,
          makeAuthenticatedRequest,
        )
          .then((chequeLoaded: cheque) => {
            if (
              !windowOpen ||
              chequesOfThisInvoice.some(
                (chequeOfThisInvoice) =>
                  chequeOfThisInvoice.chequeId != chequeLoaded.chequeId,
              )
            ) {
              console.log("Get delay cheque");
              return;
            }

            if (loadedChequesNumber > 0)
              setLoadedChequesNumber((prev) => prev - 1);
            console.log("Fetched cheque data: ", chequeLoaded);
            if (chequeLoaded && chequeLoaded.base64StringChequeCopy) {
              console.log("set new Cheque");
              setInvoiceCheques((prev) =>
                prev.map((row) =>
                  row.cheque.chequeId === chequeLoaded.chequeId
                    ? {
                        ...row,
                        cheque: {
                          ...row.cheque,
                          base64StringChequeCopy:
                            chequeLoaded.base64StringChequeCopy,
                        },
                      }
                    : row,
                ),
              );
              setChequeCopy(
                chequeLoaded.chequeId,
                chequeLoaded.base64StringChequeCopy,
              );
            }
          })
          .catch((err) => {
            if (loadedChequesNumber > 0)
              setLoadedChequesNumber((prev) => prev - 1);
            console.error(
              "Error fetching cheque data for chequeId",
              item.cheque.chequeId,
              ":",
              err,
            );
            addAlert(String(err), 'error', 10000);
          });
      });
    }
  }, [windowOpen, dataArray]);

  useEffect(() => {
    console.log("Cheque data updated: ", invoiceCheques);
    if (loadedChequesNumber <= 0) {
      setLoadingCheques(false);
    }
  }, [loadedChequesNumber]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!loadingInvoiceCheques && (!dataArray || dataArray.length === 0)) {
    return (
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <ShowcaseSection title="No Data Available" className="!p-6.5">
          <p>No cheque found to display.</p>
        </ShowcaseSection>
      </div>
    );
  }

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "id",
      valueGetter: (value, row) =>
        row.invoice.invoiceId + "-" + row.cheque.chequeId,
    },
    {
      field: "PaymentDate",
      headerName: "Payment Date",
      flex: 2,
      align: "center",
      headerAlign: "center",
      valueGetter: (value, row) => row.paymentDate,
      renderCell: (params) => (
        <h5 className="text-dark dark:text-white">{params.value}</h5>
      ),
    },
    {
      field: "Amount",
      headerName: "Amount",
      flex: 2,
      align: "center",
      headerAlign: "center",
      valueGetter: (value, row) => row.amount,
      renderCell: (params) => (
        <h5 className="text-dark dark:text-white">{params.value}</h5>
      ),
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
          {params.value.base64StringChequeCopy ? (
            <button
              className="text-dark dark:text-white"
              type="button"
              onClick={() => {
                if (params.value) {
                  console.log(
                    "View Cheque clicked for cheque copy:",
                    params.value.base64StringChequeCopy,
                  );
                  setImageSrcToView(params.value.base64StringChequeCopy);
                  onClose(true);
                }
              }}

            >
              <span className="sr-only">View Cheque copy</span>
              {!params.value.base64StringChequeCopy ? (
                <DisabledPreviewIcon className="fill-grey dark:fill-grey" />
              ) : (
                <PreviewIcon className="fill-dark dark:fill-white" />
              )}
            </button>
          ) : (
            <>
              <Button
                className="text-dark dark:text-white"
                type="button"
                isIconOnly
                onPress={() => fileInputRef.current?.click()}
              >
                <span className="sr-only">Upload Cheque copy</span>
                <UploadIcon className="fill-dark dark:fill-white" />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (event.target.files && event.target.files.length > 0) {
                    console.log("Cheque file selected:", event.target.files);
                    // setChequeFile(e.target.files ? e.target.files[0] : undefined);
                    fileToBase64String(
                      event.target.files ? event.target.files[0] : new Blob(),
                    )
                      .then((base64String) => {
                        console.log("Cheque file base64 string:", base64String);
                        setChequeCopy(params.value.chequeId, base64String);
                        console.log("Cheque file:", base64String);
                      })
                      .catch((error) => {
                        console.error(
                          "Error converting file to base64:",
                          error,
                        );
                      });
                  }
                }}
                style={{ display: "none" }} // Hide the native input
              />
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        height: "auto",
        maxHeight: "400px",
        width: "100%",
        paddingBottom: "2rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <DataGrid
        rows={invoiceCheques}
        columns={columns}
        getRowId={(row) => row.cheque.chequeId}
        columnVisibilityModel={{
          id: false,
        }}
        disableColumnMenu
        disableRowSelectionOnClick
        hideFooter
        loading={loadingInvoiceCheques}
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
            variant: "skeleton",
            noRowsVariant: "skeleton",
          },
        }}
      />
    </div>
  );
}

export default ChequeEditMuiDataGrid;
