"use client";
import { CheckIcon, TrashIcon, PencilSquareIcon } from "@/assets/icons";
import { getInvoiceTableData } from "@/components/Tables/fetch";
import { PreviewIcon, DownloadIcon } from "@/components/Tables/icons";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
// import { Checkbox } from "@/components/FormElements/checkbox";
import {CheckboxGroup, Checkbox} from "@heroui/checkbox";
import { Button } from "@/components/ui-elements/button";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import React, { ChangeEvent, useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import type {} from '@mui/x-data-grid/themeAugmentation';
import { invoice, invoiceArray } from "@/types/ObjectTypes/InvoiceType";

const InvoiceInputTable = ({ dataArray } : invoiceArray) => {

  const [rows, setRows] = useState(dataArray);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [totalSum, setTotalSum] = useState(dataArray.reduce((sum, item) => sum + item.amount, 0));

  useEffect(() => {
    const sum = dataArray.reduce((sum, item) => sum + item.amount, 0);
  }, [rows]);

  const handleSelectionChange = (rowSelectionModel: GridRowSelectionModel) => {
      if(rowSelectionModel.length > 0) {
      const selectedIds = rowSelectionModel as string[];
      const selectedData = rows.filter((row) => selectedIds.includes(row.id));
      const selectedSum = selectedData.reduce((sum, item) => sum + item.amount, 0);
      setSelectedRows(selectedIds);
      setTotalSum(selectedSum);
      }
      else {
        const selectedSum = dataArray.reduce((sum, item) => sum + item.amount, 0);
        setSelectedRows([]);
        setTotalSum(selectedSum);
      }
  }

  const columns: GridColDef<(typeof dataArray)[number]>[] = [
    { 
      field: 'id', 
      headerClassName: 'border-none bg-[#F7F9FC] dark:bg-dark-2',
      headerName: 'Invoice Number', 
      flex: 2,
    },
    {
      field: 'amount',
      headerClassName: 'border-none bg-[#F7F9FC] dark:bg-dark-2',
      headerName: 'Amount',
      flex: 2,
      editable: true,
    },
    {
      field: 'postcode',
      headerClassName: 'border-none bg-[#F7F9FC] dark:bg-dark-2',
      headerName: 'Postcode',
      flex: 2,
      editable: true,
    },
    {
      field: 'date',
      headerClassName: 'border-none bg-[#F7F9FC] dark:bg-dark-2',
      headerName: 'Date',
      flex: 2,
      editable: true,
    },
    {
      field: 'status',
      align: 'center',
      headerClassName: 'border-none bg-[#F7F9FC] dark:bg-dark-2',
      cellClassName: 'flex items-center justify-center',
      headerName: 'Status',
      flex: 2,
      renderCell: (params: GridRenderCellParams<any, string>) => (
        
        <div
            className={cn(
              "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
              {
                "bg-[#219653]/[0.08] text-[#219653]":
                  params.value === "Paid",
                "bg-[#D34053]/[0.08] text-[#D34053]":
                  params.value === "Unpaid",
                "bg-[#FFA70B]/[0.08] text-[#FFA70B]":
                  params.value === "Pending",
              },
            )}
          >
            {params.value}
          </div>
          
      ),
    },
    {
      field: 'action',
      headerClassName: 'border-none bg-[#F7F9FC] dark:bg-dark-2',
      cellClassName: 'flex items-center justify-center',
      headerName: 'Action',
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams<any, string>) => (
        
        <div className="flex items-center justify-end gap-x-3.5">
            <button className="hover:text-primary">
              <span className="sr-only">View Invoice</span>
              <PencilSquareIcon />
            </button>

            <button className="hover:text-primary">
              <span className="sr-only">Delete Invoice</span>
              <TrashIcon />
            </button>
          </div>
          
      ),
    },
  ];

    

    return (
      
        <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="flex-row">
          <ShowcaseSection title={"Total: $"+totalSum} className="!p-6.5">
              <div></div>
          </ShowcaseSection>
        </div>
        <DataGrid
            className="border-none bg-[#F7F9FC] dark:bg-dark-2 py-4 text-base text-dark dark:text-white"
            rows={dataArray}
            columns={columns}
            sx={{
              '& .MuiDataGrid-footerContainer': {
                backgroundColor: 'dark:#122031',
                color: 'dark:white',
              },
              '.custom-datagrid & .MuiDataGrid-root[theme="dark"]': {
                backgroundColor: 'black',
              },
              '& .MuiDataGrid-columnHeaderTitleContainer': {
                backgroundColor: 'transparent dark:bg-dark-2',
              },
              
              '& .MuiDataGrid-cell': {
                backgroundColor: 'dark:#122031',
              },
              // '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {
              //   backgroundColor: 'gray-dark',
              // },
            }}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            onRowSelectionModelChange={handleSelectionChange}
            checkboxSelection
            disableColumnMenu
        />
        {/* <CheckboxGroup
               className="w-full"
               value={selectedItems}
               onValueChange={handleCheckboxChange}> */}
        
        {/* </CheckboxGroup> */}
        <div className="py-4">
          <Button
                label="Set paid"
                variant="green"
                shape="full"
                size="default"
                icon={<CheckIcon />}
            />
        </div>
      </div>
      
    );
  };
  
  export default InvoiceInputTable;