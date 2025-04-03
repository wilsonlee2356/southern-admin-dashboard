"use client";
import { CheckIcon, TrashIcon } from "@/assets/icons";
import { PreviewIcon, DownloadIcon } from "@/components/Tables/icons";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import React, { useState } from "react";
import { Checkbox } from "@mui/material";

type Invoice = {
  id: string;
  name: string;
  amount: number;
  postcode: string;
  date: string;
  status: "Paid" | "Unpaid" | "Pending";
};

function ResultTable({ dataArray }: { dataArray: any }) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  console.log("ResultTable dataArray:", dataArray);

  if (!dataArray || dataArray.length === 0) {
    return (
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <ShowcaseSection title="No Data Available" className="!p-6.5">
          <p>No invoices found to display.</p>
        </ShowcaseSection>
      </div>
    );
  }

  const totalAmount = dataArray.reduce(
    (sum: any, item: any) => sum + item.amount,
    0,
  );

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedRows(dataArray.map((row: Invoice) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "checkbox",
      headerName: "",
      width: 155,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.row.id)}
          onChange={(e) =>
            setSelectedRows(
              e.target.checked
                ? [...selectedRows, params.row.id]
                : selectedRows.filter((id) => id !== params.row.id),
            )
          }
          className="text-white"
        />
      ),
      renderHeader: () => (
        <Checkbox
          checked={selectedRows.length === dataArray.length}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="text-white"
        />
      ),
    },
    {
      field: "name",
      headerName: "Invoice No.",
      width: 155,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <h5 className="text-white">{params.value}</h5>,
    },
    {
      field: "date",
      headerName: "Invoice Date",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <p className="text-white">
          {dayjs(params.value).format("MMM DD, YYYY")}
        </p>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div
          className={cn(
            "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium text-white",
            {
              "bg-[#219653]/[0.08]": params.value === "Paid",
              "bg-[#D34053]/[0.08]": params.value === "Unpaid",
              "bg-[#FFA70B]/[0.08]": params.value === "Pending",
            },
          )}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: () => (
        <div className="flex items-center justify-center gap-x-3.5">
          <button className="text-white hover:text-white">
            <span className="sr-only">View Invoice</span>
            <PreviewIcon className="fill-white" />
          </button>
          <button className="text-white hover:text-white">
            <span className="sr-only">Delete Invoice</span>
            <TrashIcon className="fill-white" />
          </button>
          <button className="text-white hover:text-white">
            <span className="sr-only">Download Invoice</span>
            <DownloadIcon className="fill-white" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <ShowcaseSection
        title={`Total: $${totalAmount.toLocaleString()}`}
        className="!p-6.5"
      >
        <div></div>
      </ShowcaseSection>
      <div style={{ height: "auto", width: "100%" }}>
        <DataGrid
          rows={dataArray}
          columns={columns}
          disableColumnMenu
          disableRowSelectionOnClick
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
      />
    </div>
  );
}

export default ResultTable;
