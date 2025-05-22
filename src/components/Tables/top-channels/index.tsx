"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { compactFormat, standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { getTopChannels } from "../fetch";
import { Tab } from "@mui/material";
import { invoiceOutstandingSummary } from "@/types/ObjectTypes/InvoiceType";
import { useEffect } from "react";

type ChannelType = {
  outstandingList: (string | number)[][];
  className: string;
};


export function TopChannels({ className, outstandingList }: ChannelType) {
  //const data = await getTopChannels();

  // useEffect(() => {
  //     //console.log("Outstanding:", outstandingList);
  //     // outstandingList.map((outstanding) => {
  //     //   console.log("Outstanding:", outstanding);
  //     //   console.log("Client Name:", outstanding[0]);
  //     //   console.log("Number of Invoices:", outstanding[0]);
  //     //   console.log("Total Outstanding:", outstanding[0]);
  //     // });
  //   }, []);
  

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
        Most Outstandings
      </h2>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="!text-left">Number</TableHead>
            <TableHead className="!text-left">Client</TableHead>
            <TableHead>Number Of Invoices</TableHead>
            <TableHead className="!text-center">Total Outstanding</TableHead>
            {/* <TableHead>Sales</TableHead> */}
            {/* <TableHead>Longest Overdue</TableHead> */}
          </TableRow>
        </TableHeader>

        <TableBody>
          {outstandingList.map((outstanding, i) => (
            <TableRow
              className="text-center text-base font-medium text-dark dark:text-white"
              key={i}
            >
              <TableCell className="text-left">
                {i+1}
              </TableCell>
              <TableCell className="flex min-w-fit items-center gap-3">
                {/* <Image
                  src={channel.logo}
                  className="size-8 rounded-full object-cover"
                  width={40}
                  height={40}
                  alt={channel.name + " Logo"}
                  role="presentation"
                /> */}
                <div className="">{outstanding[2]}</div>
              </TableCell>

              <TableCell>{outstanding[0]}</TableCell>

              <TableCell className="!text-center text-red-500">
                {outstanding[1]}
              </TableCell>

              {/* <TableCell>{outstanding.sales}</TableCell> */}

              {/* <TableCell>{channel.conversion}%</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
