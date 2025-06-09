import { invoiceData, invoiceCheques } from "@/types/ObjectTypes/InvoiceType";

type DataPropsType = {
    received: { x: string; y: number }[];
    due: { x: string; y: number }[];
};

export function createMonthlyTimeData(invoices : invoiceData[], invoiceCheques : invoiceCheques[]) : DataPropsType {
  const processedData : DataPropsType = {
        received: [],
        due: [],
    };
    invoiceCheques.forEach((item : invoiceCheques) => {
        const shortMonth = item.paymentDate.toLocaleString('default', { month: 'short'});

        const foundMonthReceivedData = processedData.received.find((d) => d.x === shortMonth);

        if(foundMonthReceivedData != null){
            console.log("Found month in received: ", shortMonth, item.amount);
            foundMonthReceivedData.y += item.amount;
        } else {
            console.log("Adding new month to received: ", shortMonth, item.amount);
            processedData.received.push({ x: shortMonth, y: item.amount });
        }
    });

    invoices.forEach((item : invoiceData) => {
        const shortMonth = item.invoiceDate.toLocaleString('default', { month: 'short'});

        const foundMonthDueData = processedData.received.find((d) => d.x === shortMonth);

        if(foundMonthDueData != null){
            foundMonthDueData.y += (item.amount - item.paidAmount);
        } else {
            processedData.due.push({ x: shortMonth, y: item.amount - item.paidAmount });
        }
    });

    console.log("Processed Data: ", processedData);

    return processedData;
}
