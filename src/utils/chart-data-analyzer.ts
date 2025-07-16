import { invoiceData, invoiceCheques, chartData, invoiceChartData, invoiceChequeChartData } from "@/types/ObjectTypes/InvoiceType";

type DataPropsType = {
    data:{
        received: { x: string; y: number }[];
        due: { x: string; y: number }[];
    };
};

export function createMonthlyTimeData(chartData: chartData) : DataPropsType {
  const processedData : DataPropsType = {
        data:{
            received: [],
            due: [],
        }
    };
    const currentDate = new Date();
    let month = currentDate.getMonth() + 1; // Months are 0-indexed in JavaScript
    let year = currentDate.getFullYear() - 1;//start from last year
    // let isCurrentYear = false;
    
    for (let i = 0; i < 13; i++) {
        if(month < 13){
            processedData.data.received.push({ x: month + '/' + year, y: 0 });
            processedData.data.due.push({ x: month + '/' + year, y: 0 });
            month++;
        } else {
            month = 1; // Reset to January
            year++;
            // processedData.data.received.push({ x: month + '/' + year, y: 0 });
        }
    }
    console.log("Processed Data Received: ", processedData.data.received);
    console.log("Processed Data Due: ", processedData.data.due);

    chartData.invoiceChequeChartData.forEach((item : invoiceChequeChartData) => {
        // const shortMonth = item.paymentDate.toLocaleString('default', { month: 'short'});
        const paymentDate = new Date(item.paymentDate);
        const shortMonthAndYear = paymentDate.getMonth() + 1 + '/' + paymentDate.getFullYear();

        const foundMonthReceivedData = processedData.data.received.find((d) => d.x === shortMonthAndYear);

        if(foundMonthReceivedData != null){
            console.log("Found month in received: ", shortMonthAndYear, item.amount);
            foundMonthReceivedData.y += item.amount;
        } 
        // else {
        //     console.log("Adding new month to received: ", shortMonthAndYear, item.amount);
        //     processedData.data.received.push({ x: shortMonthAndYear, y: item.amount });
        //     console.log("Processed Data Received: ", processedData.data.received);
        // }
    });

    chartData.invoiceChartData.forEach((item : invoiceChartData) => {
        // const shortMonth = item.invoiceDate.toLocaleString('default', { month: 'short'});
        const invoiceDate = new Date(item.invoiceDate);
        const shortMonthAndYear = invoiceDate.getMonth() + 1 + '/' + invoiceDate.getFullYear();

        const foundMonthDueData = processedData.data.due.find((d) => d.x === shortMonthAndYear);

        if(foundMonthDueData != null){
            foundMonthDueData.y += (item.amount - item.paidAmount);
        } 
        // else if((item.amount - item.paidAmount) > 0) {
        //     processedData.data.due.push({ x: shortMonthAndYear, y: item.amount - item.paidAmount });
        // }
    });

    // if(processedData.data.received.length < processedData.data.due.length){
    //     if(processedData.data.received.at(-1)?.x !== processedData.data.due.at(-1)?.x){

    //     }

    // }

    console.log("Processed Data: ", processedData);

    return processedData;
}
