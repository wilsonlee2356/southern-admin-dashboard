"use client";
import { CheckIcon, DoubleCheckIcon, TrashIcon } from "@/assets/icons";
import { PreviewIcon, EditIcon } from "@/components/Tables/icons";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";
import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import InvoicePopUp from "@/components/Layouts/Dialog/InvoicePopUp";
import InvoiceEditPopUp from "@/components/Layouts/Dialog/InvoiceEditPopUp";
import InvoiceViewPopUp from "@/components/Layouts/Dialog/InvoiceViewPopUp";
import { MuiCheckbox } from "@/components/FormElements/Checkboxes/MuiCheckbox";
import ComfirmPopUp from "@/components/Layouts/Dialog/ComfirmPopUp";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { invoiceData } from "@/types/ObjectTypes/InvoiceType";
import { CombinedService } from "@/app/api/invoice";

type MuiDataGridWithPopUpButtonProps = {
  dataArray: invoiceData[];
  popUpOpen: boolean;
  setPopUpOpen: any;
  popUpOpenEdit: boolean;
  setPopUpOpenEdit: any;
  popUpOpenView: boolean;
  setPopUpOpenView: any;
  setFilteredData: any;
  showNotEndedPosts: boolean;
  setShowNotEndedPosts: (value: boolean) => void;
  showEndedPosts: boolean;
  setShowEndedPosts: (value: boolean) => void;
  showUnpaidInvoices: boolean;
  setShowUnpaidInvoices: (value: boolean) => void;
  showPaidInvoices: boolean;
  setShowPaidInvoices: (value: boolean) => void;
  setUpdateDataNeeded: any; // Optional prop to trigger data update

};

function MuiDataGridWithPopUpButton({
  dataArray,
  popUpOpen,
  setPopUpOpen,
  popUpOpenEdit,
  setPopUpOpenEdit,
  popUpOpenView,
  setPopUpOpenView,
  setFilteredData,
  showEndedPosts,
  setShowEndedPosts,
  showNotEndedPosts,
  setShowNotEndedPosts,
  showUnpaidInvoices,
  setShowUnpaidInvoices,
  showPaidInvoices,
  setShowPaidInvoices,
  setUpdateDataNeeded, // Optional prop to trigger data update
}: MuiDataGridWithPopUpButtonProps) {
  const [selectedRows, setSelectedRows] = useState<invoiceData[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0
    //dataArray.reduce((sum: any, item: any) => sum + item.amount, 0),
  );
  const [canSetPay, setCanSetPay] = useState<boolean>(false);

  const [editingRow, setEditingRow] = useState<invoiceData>({} as invoiceData);

  const [deleteingRow, setDeletingRow] = useState<number>(-1);

  const [confirmPopUpOpen, setConfirmPopUpOpen] = useState<boolean>(false);

  useEffect(() => {
    // console.log("Data array updated:", dataArray);
    const total = dataArray.reduce(
      (sum: number, item: any) => sum + item.amount,
      0,
    );
    setTotalAmount(total);
  }, [dataArray]);

  // useEffect(() => {
  //   console.log("Row selected:", editingRow);
  // }, [editingRow]);

  if (!dataArray || dataArray.length === 0) {
    return (
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        
        <div className="mb-4.5 flex items-center justify-between">
            <label className="mb-3 block text-body-xl font-medium text-dark">
              No data available
            </label>
            <div className="full-width flex items-right justify-end gap-x-3.5">
              <MuiCheckbox
                          label="Unpaid invoice"
                          name="unpaidInvoice"
                          checked={showUnpaidInvoices}
                          onChange={(e) => setShowUnpaidInvoices(e.target.checked)}
                        />

              <MuiCheckbox
                          label="Paid invoice"
                          name="paidInvoice"
                          checked={showPaidInvoices}
                          onChange={(e) => setShowPaidInvoices(e.target.checked)}
                        />
              <MuiCheckbox
                          label="Unfinished Posts"
                          name="unfinishedPosts"
                          checked={showNotEndedPosts}
                          onChange={(e) => setShowNotEndedPosts(e.target.checked)}
                        />

              <MuiCheckbox
                          label="Finished Posts"
                          name="finishedPosts"
                          checked={showEndedPosts}
                          onChange={(e) => setShowEndedPosts(e.target.checked)}
                        />
            </div>
        </div>

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
    //console.log("Invoice found:", invoice?.post.postcode);
    return invoice;
  };

  const updateTotalAmount = (checkedRows: GridRowSelectionModel) => {
    if (checkedRows.length === 0) {
      setSelectedRows([]);
      setTotalAmount(
        dataArray.reduce((sum: number, item: any) => sum + item.amount, 0),
      );
      setCanSetPay(false);
    } else {
      //console.log("Selected rows:", checkedRows);

      const checkedData = dataArray.filter((row: any) =>
        checkedRows.includes(row.invoiceId),
      );

      const total = checkedData.reduce(
        (sum: number, item: any) => sum + item.amount,
        0,
      );

      const unPaidInvoices = checkedData.filter(
        (row: any) => row.settlementDate === null,
      );
      if (
        unPaidInvoices.length === 0 ||
        checkedData.length > unPaidInvoices.length
      ) {
        setCanSetPay(false);
      } else {
        setCanSetPay(true);
      }
      setSelectedRows(checkedData);
      setTotalAmount(total);
    }
  };

  const updateInvoiceToPaid = (invoiceId: number, invoiceToBeUpdated : invoiceData) => {
      invoiceToBeUpdated.isPaid = true;
      console.log("Updating invoice to paid: ", invoiceToBeUpdated.isPaid);
      CombinedService.update_invoice_details(invoiceToBeUpdated.invoiceId, invoiceToBeUpdated).then((res) => {
          if(res) {
              console.log("Updated invoice: ", res);
              setUpdateDataNeeded(true); // Trigger data update
          }
      });
  }

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
      valueGetter: (value, row) => row.invoiceId,
    },
    {
      field: "invoiceNum",
      headerName: "Invoice No.",
      flex: 2,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <h5 className="text-dark dark:text-white">{params.value}</h5>
      ),
    },
    {
      field: "clienName",
      headerName: "Client name",
      flex: 4,
      align: "center",
      headerAlign: "center",
      valueGetter: (value, row) => row.post.client.clientName,
      renderCell: (params) => (
        <h5 className="text-dark dark:text-white">{params.value}</h5>
      ),
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 2.5,
      align: "center",
      headerAlign: "center",
      valueGetter: (value, row) => "$"+row.paidAmount+" / $"+row.amount,
      renderCell: (params) => (
        <h5 className="text-dark dark:text-white">
          {params.value}
        </h5>
      ),
    },
    {
      field: "postCode",
      headerName: "Postcode",
      flex: 2,
      align: "center",
      headerAlign: "center",
      valueGetter: (value, row) => row.post.postcode,
      renderCell: (params) => (
        <h5 className="text-dark dark:text-white">{params.value}</h5>
      ),
    },
    {
      field: "invoiceDate",
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
      valueGetter: (value, row) => row.isPaid,
      renderCell: (params) => (
        <div
          className={cn(
            "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium text-dark dark:text-white",
            {
              "bg-[#219653]/[0.08]": params.value,
              "bg-[#D34053]/[0.08]": !params.value,
              //"bg-[#FFA70B]/[0.08]": params.value === "Pending",
            },
          )}
        >
          {params.value ? "Paid" : "Unpaid"}
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
          <button className="text-dark dark:text-white"
              onClick={() => {
                const invoice = getInvoiceById(params.id);
                if (!invoice) return;
                setEditingRow(invoice);
                setPopUpOpenView(true);
              }}
            >
            <span className="sr-only">View Invoice</span>
            <PreviewIcon className="fill-dark dark:fill-white" />
          </button>
          <button className="text-dark dark:text-white"
            onClick={() => {
              setDeletingRow(params.id as number);
              setConfirmPopUpOpen(true);
            }}>
            <span className="sr-only">Delete Invoice</span>
            <TrashIcon className="fill-dark dark:fill-white" />
          </button>
          <button
            className="text-dark dark:text-white"
            onClick={() => {
              const invoice = getInvoiceById(params.id);
              if (!invoice) return;
              setEditingRow(invoice);
              setPopUpOpenEdit(true);
            }}
          >
            <span className="sr-only">Edit Invoice</span>
            <EditIcon className="fill-dark dark:fill-white" />
          </button>
          <button className="text-dark dark:text-white"
            onClick={() => {
              const invoice = getInvoiceById(params.id);
              if (!invoice) return;
              updateInvoiceToPaid(invoice.invoiceId, invoice);
              setUpdateDataNeeded(true); // Trigger data update
            }}>
            <span className="sr-only">Set Paid Invoice</span>
            <CheckIcon className="fill-dark dark:fill-white" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      {/* <ShowcaseSection
        title={`Total: $${totalAmount.toLocaleString()}`}
        className="!p-6.5"
      > */}
        <div className="mb-4.5 flex items-center justify-between">
            <label className="mb-3 block text-body-xl font-medium text-dark">
              {`Total: $${totalAmount.toLocaleString()}`}
            </label>
            <div className="full-width flex items-right justify-end gap-x-3.5">
              <MuiCheckbox
                          label="Unpaid invoice"
                          name="unpaidInvoice"
                          checked={showUnpaidInvoices}
                          onChange={(e) => setShowUnpaidInvoices(e.target.checked)}
                        />

              <MuiCheckbox
                          label="Paid invoice"
                          name="paidInvoice"
                          checked={showPaidInvoices}
                          onChange={(e) => setShowPaidInvoices(e.target.checked)}
                        />
              <MuiCheckbox
                          label="Unfinished Posts"
                          name="unfinishedPosts"
                          checked={showNotEndedPosts}
                          onChange={(e) => setShowNotEndedPosts(e.target.checked)}
                        />

              <MuiCheckbox
                          label="Finished Posts"
                          name="finishedPosts"
                          checked={showEndedPosts}
                          onChange={(e) => setShowEndedPosts(e.target.checked)}
                        />
            </div>
        </div>
      {/* </ShowcaseSection> */}
      <div style={{ height: "auto", width: "100%", paddingBottom: "2rem" }}>
        <DataGrid
          rows={dataArray}
          columns={columns}
          getRowId={(row) => row.invoiceId}
          columnVisibilityModel={{
            id: false,
          }}
          // isRowSelectable={(params: GridRowParams) => params.row.status === "Unpaid"}
          onRowSelectionModelChange={(checkedRows) => {
            updateTotalAmount(checkedRows);
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
        disabled={!canSetPay}
        onClick={() => {
          setPopUpOpen(true);
        }}
      />
      <InvoicePopUp
        title="Upload cheque or statement"
        open={popUpOpen}
        onClose={setPopUpOpen}
        dataArray={selectedRows}
        setDataArray={setFilteredData}
        setUpdateDataNeeded={setUpdateDataNeeded}
      />

      <InvoiceEditPopUp
        title="Edit invoice"
        open={popUpOpenEdit}
        onClose={setPopUpOpenEdit}
        invoiceInfo={editingRow}
        setDataArray={setFilteredData}
        setUpdateDataNeeded={setUpdateDataNeeded}
      />

      <InvoiceViewPopUp
        title="View invoice"
        open={popUpOpenView}
        onClose={setPopUpOpenView}
        invoiceInfo={editingRow}
        setDataArray={setFilteredData}
        
      />

      <ComfirmPopUp
        title="Confirm"
        message="Are you sure you want to delete?"
        confirmButtonText="Delete"
        open={confirmPopUpOpen}
        onClose={setConfirmPopUpOpen}
        functionToRun={() => {
          if(deleteingRow !== -1){
            const invoice = getInvoiceById(deleteingRow);
              if (!invoice) return;
              CombinedService.delete_invoice_by_id(invoice.invoiceId).then((res) => {
                console.log("Deleted invoice: ", res);
                  const updatedData = dataArray.filter(
                    (item) => item.invoiceId !== invoice.invoiceId,
                  );
                  setFilteredData(updatedData);
                  setDeletingRow(-1);
              }
              ).catch((err) => {
                console.log("Error deleting invoice: ", err);
              });
          }
          
          
        }}
      />
    </div>
  );
}

export default MuiDataGridWithPopUpButton;
