"use client";
import { PeriodPicker } from "@/components/period-picker";
import { standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { getPaymentsOverviewData } from "@/services/charts.services";
import { PaymentsOverviewChart } from "./chart";
import { InvoiceService } from "@/app/api/services/invoiceService";
import { CombinedService } from "@/app/api/invoice";
import { createMonthlyTimeData } from "@/utils/chart-data-analyzer";
import { invoiceData, invoiceCheques } from "@/types/ObjectTypes/InvoiceType";
import { useAuthenticatedRequest } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type PropsType = {
  timeFrame?: string;
  className?: string;
};

type DataPropType = {
  data: {
    received: { x: unknown; y: number }[];
    due: { x: unknown; y: number }[];
  };
};

export function PaymentsOverview({
  timeFrame = "monthly",
  className,
}: PropsType) {
  // const data = await getPaymentsOverviewData(timeFrame);

  const { makeAuthenticatedRequest } = useAuthenticatedRequest();
  const [invoiceData, setInvoiceData] = useState<invoiceData[]>([]);
  const [invoiceCheques, setInvoiceCheques] = useState<invoiceCheques[]>([]);
  const [chartData, setChartData] = useState<DataPropType>({
    data: {
      received: [],
      due: []
    }
  });
  const { data: session, status } = useSession();

  useEffect(() => {
    if(status === "authenticated" && session?.accessToken){
      console.log("Trying to fetch invoice sort by date: ", status);
      CombinedService.get_all_invoice_sorted_by_date(makeAuthenticatedRequest).then((invoicesList)=>{
        setInvoiceData(invoicesList);
        console.log("invoices:", invoiceData);
        CombinedService.get_all_invoiceCheques(makeAuthenticatedRequest).then((invoiceChequesList)=>{
          setInvoiceCheques(invoiceChequesList);
          console.log("invoiceCheques:", invoiceCheques);
          setChartData(createMonthlyTimeData(invoiceData, invoiceCheques));
        });
      });
    }
      // CombinedService.get_invoice_outstanding_summary(makeAuthenticatedRequest).then((data)=>{
      //   setOutstandingList(data);
      //   console.log("Outstanding:", outstandingList);
      // });
  }, [session, status]);
  //const invoiceData = await CombinedService.get_all_invoice_sorted_by_date(makeAuthenticatedRequest);
  //const invoiceCheques = await CombinedService.get_all_invoiceCheques(makeAuthenticatedRequest);
  //const chartData = createMonthlyTimeData(invoiceData, invoiceCheques);

  return (
    <div
      className={cn(
        "grid gap-2 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Payments Overview
        </h2>

        <PeriodPicker defaultValue={timeFrame} sectionKey="payments_overview" />
      </div>

      <PaymentsOverviewChart data={chartData.data} />

      <dl className="grid divide-stroke text-center dark:divide-dark-3 sm:grid-cols-2 sm:divide-x [&>div]:flex [&>div]:flex-col-reverse [&>div]:gap-1">
        <div className="dark:border-dark-3 max-sm:mb-3 max-sm:border-b max-sm:pb-3">
          <dt className="text-xl font-bold text-dark dark:text-white">
            ${standardFormat(chartData.data.received.reduce((acc, { y }) => acc + y, 0))}
          </dt>
          <dd className="font-medium dark:text-dark-6">Received Amount</dd>
        </div>

        <div>
          <dt className="text-xl font-bold text-dark dark:text-white">
            ${standardFormat(chartData.data.due.reduce((acc, { y }) => acc + y, 0))}
          </dt>
          <dd className="font-medium dark:text-dark-6">Due Amount</dd>
        </div>
      </dl>
    </div>
  );
}
