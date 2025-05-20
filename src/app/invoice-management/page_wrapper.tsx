"use client";
import { useState, useEffect } from "react";
import SearchBox from "./_components/search-box";
import ResultTable from "./_components/result-table";
import { client, post, invoiceData } from "@/types/ObjectTypes/InvoiceType";
import MuiDataGridWithPopUpButton from "@/components/Tables/DataGrid/MuiDataGridWithPopUpButton";
import { InvoiceService } from "../api/services/invoiceService";
import { CombinedService } from "@/app/api/invoice";
import { start } from "repl";
import { Dayjs } from "dayjs";

type PageWrapperProps = {
  dataArray: any[]; // Pass data as a prop instead of fetching here
  clientData: client[];
  postData: post[];
};

export default function PageWrapper({ dataArray, clientData, postData }: PageWrapperProps) {
  const [filteredData, setFilteredData] = useState<invoiceData[]>(dataArray);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [startDate, setstartDate] = useState<Dayjs | null>(null);
  const [endDate, setendDate] = useState<Dayjs | null>(null);
  const [popUpOpen, setPopUpOpen] = useState(false);
  const [popUpOpenEdit, setPopUpOpenEdit] = useState(false);
  const [updateDataNeeded, setUpdateDataNeeded] = useState(false);

  let data =  dataArray;
  let clients = clientData;
  let posts = postData;

  useEffect(() => {
    const selectedData = dataArray.filter((row: any) =>
      (
        (!checkEmpty(invoiceNumber) ? row.invoiceNum.includes(invoiceNumber) : true) && 
        (!checkEmpty(clientName) ? row.post.client.clientName.toLowerCase().includes(clientName.toLowerCase()) : true) && 
        (!checkEmpty(postcode) ? row.post.postcode.toLowerCase().includes(postcode.toLowerCase()) : true) 
        && checkDateWithinPeriod(row.invoiceDate, startDate?.toDate() ?? null, endDate?.toDate() ?? null)
        //&& (!checkEmpty(startDate) ? checkDateWithinMonths(row.invoiceDate, parseInt(startDate)) : true)
      )
    );
    console.log("startDate", startDate);
    setFilteredData(selectedData);
  }, [invoiceNumber, clientName, postcode, startDate, endDate, dataArray]);

  useEffect(() => {
    if(updateDataNeeded){
      
      InvoiceService.getAll().then((res) => {
        setFilteredData(res);
      }
      );
      CombinedService.get_all_client().then((res) => {
        clients = res;
      }
      );
      CombinedService.get_all_post().then((res) => {
        posts = res;
      }
      );
      setUpdateDataNeeded(false);
      
    }
  }, [updateDataNeeded]);

  // useEffect(() => {
  //   console.log({ filteredData });
  // }, [filteredData]);

  const checkEmpty = (value: string) => {
    return value === "" || value === undefined || value === null; 
  };

  const compareDatesLarger = (date1: Date, date2: Date) => {
    if (date1.getFullYear() > date2.getFullYear())
      return true;
    else if (date1.getFullYear() < date2.getFullYear())
      return false;
    else {
      if (date1.getMonth() > date2.getMonth())
        return true;
      else if (date1.getMonth() < date2.getMonth())
        return false;
      else {
        if (date1.getDate() >= date2.getDate())
          return true;
        else
          return false;
      }
    }
  }

  const checkDateWithinPeriod = (targetDate: Date, startDate: Date | null, endDate: Date | null) => {
    const targetDateObj = new Date(targetDate);
    const startDateObj = startDate ? new Date(startDate) : null;
    const endDateObj = endDate ? new Date(endDate) : null;
    
    if(startDateObj && endDateObj){
      return compareDatesLarger(targetDateObj, startDateObj) && compareDatesLarger(endDateObj, targetDateObj);
    } else {
      console.log("targetDate >= startDate", startDateObj && compareDatesLarger(targetDateObj, startDateObj));
      return startDateObj && compareDatesLarger(targetDateObj, startDateObj) || endDateObj && compareDatesLarger(endDateObj, targetDateObj);
    }
      
  };

  const checkDateWithinMonths = (date: Date, months: number) => {
    const currentDate = new Date();
    const targetDate = new Date(date);
    targetDate.setMonth(targetDate.getMonth() + months);
    return currentDate <= targetDate;
  };

  return (
    <>
      <SearchBox
        dataArray={data}
        clientData={clients} 
        postData={posts} 
        invoiceNumber={invoiceNumber}
        clientName={clientName}
        postcode={postcode}
        startDate={startDate}
        endDate={endDate}
        setInvoiceNumber={setInvoiceNumber}
        setClientName={setClientName}
        setPostcode={setPostcode}
        setStartDate={setstartDate}
        setEndDate={setendDate}
        setFilteredData={setFilteredData}
        setUpdateDataNeeded={setUpdateDataNeeded}
      />
      <MuiDataGridWithPopUpButton
        dataArray={filteredData}
        popUpOpen={popUpOpen}
        setPopUpOpen={setPopUpOpen}
        popUpOpenEdit={popUpOpenEdit}
        setPopUpOpenEdit={setPopUpOpenEdit}
        setFilteredData={setFilteredData}
      />
    </>
  );
}
