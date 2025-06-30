"use client";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@heroui/button";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { PaidAmountsType, invoiceData } from "@/types/ObjectTypes/InvoiceType";
import { NumberInput } from "@heroui/react";

type SimpleMuiDataGridProps = {
  dataArray: invoiceData[];
  paidAmounts: PaidAmountsType[];
  setPaidAmounts: any;
};

function SimpleMuiDataGrid({
  dataArray,
  paidAmounts,
  setPaidAmounts,
}: SimpleMuiDataGridProps) {
  useEffect(() => {
    // Initialize paidAmounts with empty objects for each invoice
    const initialPaidAmounts = dataArray.map((invoice) => ({
      invoiceId: invoice.invoiceId,
      amount: null,
    }));
    setPaidAmounts(initialPaidAmounts);
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
      field: "invoiceNum",
      headerName: "Invoice No.",
      flex: 2,
      align: "center",
      headerAlign: "center",
      valueGetter: (value, row) => row.invoiceNum,
      renderCell: (params) => (
        <h5 className="text-dark dark:text-white">{params.value}</h5>
      ),
    },
    {
      field: "clienName",
      headerName: "Client name",
      flex: 2,
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
      flex: 2,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <h5 className="text-dark dark:text-white">
          {"$" + params.value.toLocaleString()}
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
      field: "createDate",
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
      field: "settlementDate",
      headerName: "Status",
      flex: 2,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div
          className={cn(
            "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium text-dark dark:text-white",
            {
              "bg-[#219653]/[0.08]": params.value !== null,
              "bg-[#D34053]/[0.08]": params.value === null,
              //"bg-[#FFA70B]/[0.08]": params.value === "Pending",
            },
          )}
        >
          {params.value !== null ? "Paid" : "Unpaid"}
        </div>
      ),
    },
    {
      field: "amountPaid",
      headerName: "Enter Amount Paid",
      flex: 2,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <NumberInput
          isRequired
          hideStepper
          classNames={{
            input: [
              "w-full",
              "focus:outline-none",
              "focus:ring-none",
              "focus:border-none",
            ],
            inputWrapper: ["w-full", "bg-gray"],
          }}
          endContent={
            <Button
              variant="light"
              className="bg-transparent text-red-500 dark:bg-gray-700 dark:text-white"
              onPress={() => {
                console.log(
                  "Max button clicked for invoiceId:",
                  params.row.invoiceId,
                );
                const updatedPaidAmount = paidAmounts.map((item) =>
                  item.invoiceId === params.row.invoiceId
                    ? {
                        ...item,
                        amount:
                          params.row.amount - (params.row.paidAmount || 0),
                      }
                    : item,
                );
                setPaidAmounts(updatedPaidAmount);
              }}
            >
              Max
            </Button>
          }
          aria-label="Enter Amount Paid"
          aria-placeholder="Enter Amount Paid"
          value={
            paidAmounts.find((item) => item.invoiceId === params.row.invoiceId)
              ?.amount || undefined
          }
          onChange={(value) => {
            if (Number(value) < params.row.amount - params.row.paidAmount) {
              console.log("Value changed:", value);
              const updatedPaidAmounts = paidAmounts.map((item) =>
                item.invoiceId === params.row.invoiceId
                  ? { ...item, amount: parseFloat(value.toString()) }
                  : item,
              );
              setPaidAmounts(updatedPaidAmounts);
            }
          }}
          variant="underlined"
          placeholder="Enter the amount"
          maxValue={params.row.amount - (params.row.paidAmount || 0)}
        />
      ),
    },
  ];

  return (
    <div style={{ height: "auto", width: "100%" }}>
      <DataGrid
        rows={dataArray}
        columns={columns}
        getRowId={(row) => row.invoiceId}
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
  );
}

export default SimpleMuiDataGrid;
