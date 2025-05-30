"use client";
import React, { JSX } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui-elements/button";
import { CheckIcon } from "@/assets/icons";
import { Dialog, DialogContent, DialogContentText, DialogProps, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import UploadButton from "@/components/ui-elements/upload-button";
import InputGroup from "@/components/FormElements/InputGroup";
import FilePreviewWindow from "@/components/ui-elements/FilePreviewWindow";
import DatePickerThree from "@/components/FormElements/DatePicker/DatePickerThree";
import { TextAreaOne } from "@/components/FormElements/InputGroup/TextAreaOne";
import DataLabel from "../Datalabel/dataLabel";
import { invoiceData } from "@/types/ObjectTypes/InvoiceType";
import { CombinedService } from "@/app/api/invoice";
import MuiDatePicker from "@/components/FormElements/DatePicker/MuiDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { cn } from "@/lib/utils";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

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

    useEffect(() => {
        if(invoiceInfo == null || invoiceInfo == undefined || Object.keys(invoiceInfo).length === 0) 
            return;
        else {
            setInvoiceNum(invoiceInfo?.invoiceNum);
            setPostcode(invoiceInfo?.post.postcode);
            setAmount(invoiceInfo?.amount);
            setClientName(invoiceInfo?.post.client.clientName);
            setFullName(toEmptyIfNull(invoiceInfo?.post.client.fullName));
            setAddress(toEmptyIfNull(invoiceInfo?.post.address));
            setInvoiceDate(dayjs(invoiceInfo?.invoiceDate));
        }
        
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Handle submit");

        console.log("Invoice Number: ", invoiceNum);
        console.log("Postcode: ", postcode);
        console.log("Client Name: ", clientName);
        console.log("Amount: ", amount);
        console.log("Invoice Date: ", invoiceDate);
        
        const newDate = new Date();

        // \/ \/ \/ \/ \/ \/ \/ \/ UNCOMMENT

        const updateInvoice : invoiceData = {
            invoiceId: invoiceInfo.invoiceId,
            invoiceNum: invoiceNum,
            post: {
                postId: invoiceInfo.post.postId,
                postcode: postcode,
                address: "",
                isEnded: false,
                client: {
                    clientId: invoiceInfo.post.client.clientId,
                    clientName: clientName,
                    fullName: invoiceInfo.post.client.fullName,
                    createDate: invoiceInfo.post.client.createDate,
                    updateDate: newDate.toISOString(),
                },
                createDate: invoiceInfo.post.createDate,
                updateDate: newDate.toISOString(),
            },
            
            invoiceDate: invoiceDate?.toDate(),
            amount: amount,
            paidAmount: invoiceInfo.paidAmount,
            settlementDate: null,
            statementId: null,
            createDate: invoiceInfo.createDate,
            updateDate: newDate,
        };
        CombinedService.update_invoice_details(invoiceInfo.invoiceId, updateInvoice).then((res) => {
            if(res) {
                console.log("Updated invoice: ", res);
                setDataArray((prevData: any) => {
                    return prevData.map((item: any) => {
                        if (item.invoiceId === invoiceInfo.invoiceId) {
                            return { ...item, ...updateInvoice };
                        }
                        return item;
                    });
                });
                
            }
        });
        
        // ^^^^^^^^^^^^^^Uncomment the following lines to update the invoice in the database

        // UPDATE_INVOICE_BY_ID(invoiceInfo.invoiceId, updateInvoice).then((res) => {
        // UPDATE_INVOICE_DETAILS(invoiceInfo.invoiceId, updateInvoice).then((res) => {
        //     console.log("Updated invoice: ", res);
        // }
        // ).catch((err) => {
        //     console.log("Error updating invoice: ", err);
        // }
        // );

    };
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
                        <form onSubmit={handleSubmit} className="w-xl h-full flex flex-col gap-4.5 justify-start items-start content-stretch">
                            <div className="mb-4.5 flex flex-row gap-4.5">
                                <DataLabel
                                    label="Invoice Number"
                                    content={invoiceNum}
                                    className="w-full xl:w-5/12" // 40% width on extra-large screens
                                />
                                <DataLabel
                                    label="Postcode"
                                    content={postcode}
                                    className="w-full xl:w-5/12" // 40% width on extra-large screens
                                />
                                <DataLabel
                                    label="Amount"
                                    content={amount.toString()}
                                    className="w-full xl:w-5/12" // 40% width on extra-large screens
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
                            <div className="mb-4.5 flex flex-row gap-4.5">
                                <DataLabel
                                    label="Client Name"
                                    content={clientName}
                                    className="w-full xl:w-5/12" // 40% width on extra-large screens
                                />
                                <DataLabel
                                    label="Full Name"
                                    content={fullName=="" ? "N/A" : fullName}
                                    className="w-full xl:w-5/12" // 40% width on extra-large screens
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
                            <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                                <DataLabel
                                    label="Address"
                                    content={address=="" ? "N/A" : address}
                                    className="w-full xl:w-6/12" // 40% width on extra-large screens
                                />
                                <DataLabel
                                    label="Invoice Date"
                                    content={invoiceDate.toString()}
                                    className="w-full xl:w-6/12" // 40% width on extra-large screens
                                />
                            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <MuiDatePicker
                                    title="Invoice Date"
                                    label="Invoice Date"
                                    value={dayjs(invoiceDate)}
                                    onChange={(e) => {
                                        setInvoiceDate(e as Dayjs);
                                    }}
                                />
                            </LocalizationProvider> */}
                                {/* <DatePickerThree 
                                    label="Invoice Date" 
                                    value={invoiceDate.toString()}
                                    handleChange={(e) => {
                                        
                                        setInvoiceDate(e.target.value);
                                    }}/> */}
                            {/* {
                                invoiceInfo?.settlementDate ? (
                                    <div className="w-full xl:w-6/12">
                                        <DatePickerThree 
                                            label="Settlement Date" 
                                            value={invoiceInfo?.settlementDate}
                                            // handleChange={(param) => {
                                            //     setInvoiceNum(param.target.value);
                                            // }}
                                            />
                                    </div>
                                ) : null
                            } */}
                            
                            </div>
                            {/* <Button
                                label="Change"
                                variant="green"
                                shape="full"
                                size="default"
                                type="submit"
                                icon={<CheckIcon className="fill-white" />}
                                onClick={() => {
                                    
                                }}
                            /> */}
                        </form>
                    {/* </ShowcaseSection> */}
                </div>
            </DialogContent>
            <DialogContent>
                
            </DialogContent>
        </Dialog>
    </>
    );
};

export default InvoiceViewPopUp;
