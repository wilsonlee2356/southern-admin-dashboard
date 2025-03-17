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
import React, { ChangeEvent, useState } from "react";

type invoice = {
    name: string;
    price: number;
    date: string;
    status: string;
}

type invoiceArray = {
    dataArray: invoice[];
}




const TableListOne = ({ dataArray } : invoiceArray) => {

    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const [isAllSelected, setIsAllSelected] = useState(false);

    const handleSelectAll = () => {
        if (!isAllSelected) {
            // Select all items
            setSelectedItems(dataArray.map((item) => item.name));
          } else {
            // Deselect all items
            setSelectedItems([]);
          }
        setIsAllSelected(!isAllSelected);
    };

    const handleCheckboxChange = (values: string[]) => {
        setSelectedItems(values);
        setIsAllSelected(values.length === dataArray.length);
    };
    

    return (
        <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="flex-row">
          <ShowcaseSection title="Total: $9999999999" className="!p-6.5">
              <div></div>
          </ShowcaseSection>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead className="min-w-[155px] xl:pl-7.5">
                  {/* <Checkbox label={""} withIcon={"check"} /> */}
                  <Checkbox  isSelected={isAllSelected} onChange={handleSelectAll}/>
              </TableHead>
              <TableHead className="min-w-[155px] xl:pl-7.5">
                Invoice No.
              </TableHead>
              <TableHead>Invoice Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right xl:pr-7.5">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* <CheckboxGroup
              value={selectedItems}
              onValueChange={handleCheckboxChange}> */}
              {dataArray.map((item, index) => (
              <TableRow key={index} className="border-[#eee] dark:border-dark-3">
                <TableHead className="min-w-[155px] xl:pl-7.5">
                   {/* <Checkbox label={""} withIcon={"check"}/> */}
                   <Checkbox key={index} value={item.name}/>
                </TableHead>
                <TableCell className="min-w-[155px] xl:pl-7.5">
                  <h5 className="text-dark dark:text-white">{item.name}</h5>
                </TableCell>
  
                <TableCell>
                  <p className="text-dark dark:text-white">
                    {dayjs(item.date).format("MMM DD, YYYY")}
                  </p>
                </TableCell>
  
                <TableCell>
                  <div
                    className={cn(
                      "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
                      {
                        "bg-[#219653]/[0.08] text-[#219653]":
                          item.status === "Paid",
                        "bg-[#D34053]/[0.08] text-[#D34053]":
                          item.status === "Unpaid",
                        "bg-[#FFA70B]/[0.08] text-[#FFA70B]":
                          item.status === "Pending",
                      },
                    )}
                  >
                    {item.status}
                  </div>
                </TableCell>
  
                <TableCell className="xl:pr-7.5">
                  <div className="flex items-center justify-end gap-x-3.5">
                    <button className="hover:text-primary">
                      <span className="sr-only">View Invoice</span>
                      <PencilSquareIcon />
                    </button>
  
                    <button className="hover:text-primary">
                      <span className="sr-only">Delete Invoice</span>
                      <TrashIcon />
                    </button>
                    {/* <button className="hover:text-primary">
                      <span className="sr-only">Download Invoice</span>
                      <DownloadIcon />
                    </button> */}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {/* </CheckboxGroup> */}
          </TableBody>
        </Table>
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
  
  export default TableListOne;