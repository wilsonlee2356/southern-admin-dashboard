"use client";
import React from "react";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DataLabel from "../Datalabel/dataLabel";
import { invoiceData } from "@/types/ObjectTypes/InvoiceType";
import { cn } from "@/lib/utils";
import dayjs, { Dayjs } from "dayjs";
import ChequeMuiDataGrid from "@/components/Tables/DataGrid/ChequeMuiDataGrid";
import PdfViewPopUp from "./PdfViewPopUp";

// type InvoiceInfoType = {
//     invoiceNum: string;
//     invoiceDate: string;
//     clientName: string;
//     amount: number;
//     status: string;
//     postcode: string;
//     settlementDate: string;
// }

type InvoiceViewPopUpPropsType = {
    title: string;
    open: boolean;
    onClose: any;
    invoiceInfo: invoiceData;
    setDataArray: any;
}



function InvoiceViewPopUp ({ title, open, onClose, invoiceInfo, setDataArray }: InvoiceViewPopUpPropsType){

    const [invoiceNum, setInvoiceNum] = React.useState<string>("");
    const [postcode, setPostcode] = React.useState<string>("");
    const [amount, setAmount] = React.useState<number>(0);
    const [clientName, setClientName] = React.useState<string>("");
    const [fullName, setFullName] = React.useState<string>("");
    const [address, setAddress] = React.useState<string>("");
    const [invoiceDate, setInvoiceDate] = React.useState<Dayjs>(dayjs(new Date()));
    const [pdfSrc, setPdfSrc] = React.useState<string>("");
    const [pdfViewPopUp, setPdfViewPopUp] = React.useState<boolean>(false);

    useEffect(() => {
        if(invoiceInfo == null || invoiceInfo == undefined || Object.keys(invoiceInfo).length === 0) 
            return;
        else {
            setInvoiceNum(invoiceInfo?.invoiceNum);
            setPostcode(invoiceInfo?.post.postcode);
            setAmount(invoiceInfo?.amount);
            setClientName(invoiceInfo?.post.client.clientName);
            setFullName(toEmptyIfNull(invoiceInfo?.post.client.fullName));
            setAddress(toEmptyIfNull(invoiceInfo?.post.buildingAddress));
            setInvoiceDate(dayjs(invoiceInfo?.invoiceDate));
        }
        console.log("Invoice Info : ", invoiceInfo);
    }, [invoiceInfo]);

     if(Object.keys(invoiceInfo).length === 0) return(<><div></div></>);

    //console.log("Invoice Info: ", invoiceInfo);
    const toEmptyIfNull = (value: string | null) => {
        return value === null ? "" : value;
    }

    //console.log("Pop up opened: ", invoiceNum);
    const closePopUp = ()=> {
        onClose(false);
    }

    
    return (
    <>
        <Dialog 
            open={open} onClose={onClose} fullWidth={true} 
            maxWidth={"xl"} aria-labelledby="alert-dialog-title" 
            aria-describedby="alert-dialog-description">
            <DialogTitle>{title} <IconButton onClick={closePopUp} style={{float:'right'}}><CloseIcon ></CloseIcon></IconButton> </DialogTitle>
            <DialogContent>
                <div style={{height:'500px', width:'100%'}} className="flex flex-row gap-50 justify-left items-start content-stretch">
                    {/* <ShowcaseSection title="Contact Form" className="!p-6.5 w-full h-full "> */}
                        <div className="w-xl h-full flex flex-col gap-4.5 justify-start items-start content-stretch">
                            <label className="text-body-lg font-medium text-dark">Invoice Information</label>
                            <div className="mb-4.5 flex flex-row gap-4.5">
                                
                                <DataLabel
                                    label="Invoice Number"
                                    content={invoiceInfo.invoiceNum}
                                    className="w-full xl:w-5/12" // 40% width on extra-large screens
                                />
                                <DataLabel
                                    label="Paid Amount"
                                    content={invoiceInfo.paidAmount+ " / " + invoiceInfo.amount.toString()}
                                    className="w-full xl:w-5/12" // 40% width on extra-large screens
                                />
                                <DataLabel
                                    label="Invoice Date"
                                    content={invoiceDate.toString()}
                                    className="w-full xl:w-6/12" // 40% width on extra-large screens
                                />
                                <div>
                                    <label className="text-body-sm font-medium text-dark">Invoice Status</label>
                                    <div
                                        className={cn(
                                        "mt-3 max-w-fit rounded-full px-3.5 py-1 text-sm font-medium text-dark dark:text-white",
                                        {
                                            "bg-[#219653]/[0.08]": (invoiceInfo.paidAmount-invoiceInfo.amount) > 0,
                                            "bg-[#D34053]/[0.08]": (invoiceInfo.paidAmount-invoiceInfo.amount) <= 0,
                                            //"bg-[#FFA70B]/[0.08]": params.value === "Pending",
                                        },
                                        )}
                                    >
                                        {(invoiceInfo.paidAmount-invoiceInfo.amount) > 0 ? "Paid" : "Unpaid"}
                                    </div>
                                </div>
                            </div>
                            <label className="text-body-lg font-medium text-dark">Client Information</label>
                            <div className="mb-4.5 flex flex-row gap-4.5">
                                <DataLabel
                                    label="Client Name"
                                    content={invoiceInfo.post.client.clientName}
                                    className="w-full xl:w-5/12" // 40% width on extra-large screens
                                />
                                <DataLabel
                                    label="Full Name"
                                    content={invoiceInfo.post.client.fullName=="" ? "N/A" : fullName}
                                    className="w-full xl:w-5/12" // 40% width on extra-large screens
                                />
                                <DataLabel
                                    label="Address"
                                    content={invoiceInfo.post.client.address=="" ? "N/A" : invoiceInfo.post.client.address}
                                    className="w-full xl:w-5/12" // 40% width on extra-large screens
                                />
                            </div>
                            <label className="text-body-lg font-medium text-dark">Post Information</label>
                            <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                                 <DataLabel
                                    label="Postcode"
                                    content={invoiceInfo.post.postcode}
                                    className="w-full xl:w-5/12" // 40% width on extra-large screens
                                />
                                <DataLabel
                                    label="Building Address"
                                    content={invoiceInfo.post.buildingAddress=="" ? "N/A" : invoiceInfo.post.buildingAddress}
                                    className="w-full xl:w-6/12" // 40% width on extra-large screens
                                />
                                <DataLabel
                                    label="Street Address"
                                    content={invoiceInfo.post.streetAddress=="" ? "N/A" : invoiceInfo.post.streetAddress}
                                    className="w-full xl:w-6/12" // 40% width on extra-large screens
                                />
                                <div>
                                    <label className="text-body-sm font-medium text-dark">Postcode Status</label>
                                    <div
                                        className={cn(
                                        "mt-3 max-w-fit rounded-full px-3.5 py-1 text-sm font-medium text-dark dark:text-white",
                                        {
                                            "bg-[#219653]/[0.08]": (invoiceInfo.post.isEnded),
                                            "bg-[#D34053]/[0.08]": (!invoiceInfo.post.isEnded),
                                            //"bg-[#FFA70B]/[0.08]": params.value === "Pending",
                                        },
                                        )}
                                    >
                                        {(invoiceInfo.post.isEnded) ? "Finish" : "NotFinish"}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-1/2 h-full">
                            <ChequeMuiDataGrid
                                dataArray={invoiceInfo.invoiceChequesList}
                                setImageSrcToView={setPdfSrc}
                                onClose={setPdfViewPopUp}
                            />
                        </div>
                </div>
            </DialogContent>
        </Dialog>

        <PdfViewPopUp
            pdf={pdfSrc}
            open={pdfViewPopUp}
            setOpen={setPdfViewPopUp}/>
    </>
    );
};

export default InvoiceViewPopUp;
