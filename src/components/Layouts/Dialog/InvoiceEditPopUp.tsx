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
import { invoiceData } from "@/types/ObjectTypes/InvoiceType";
import { CombinedService } from "@/app/api/invoice";
import MuiDatePicker from "@/components/FormElements/DatePicker/MuiDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
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

type InvoiceEditPopUpPropsType = {
    title: string;
    open: boolean;
    onClose: any;
    invoiceInfo: invoiceData;
    setDataArray: any;
}



function InvoiceEditPopUp ({ title, open, onClose, invoiceInfo, setDataArray }: InvoiceEditPopUpPropsType){

    const [invoiceNum, setInvoiceNum] = React.useState<string>("");
    const [postcode, setPostcode] = React.useState<string>("");
    const [amount, setAmount] = React.useState<number>(0);
    const [clientName, setClientName] = React.useState<string>("");
    const [invoiceDate, setInvoiceDate] = React.useState<Dayjs>(dayjs(new Date()));

    useEffect(() => {
        if(invoiceInfo == null || invoiceInfo == undefined || Object.keys(invoiceInfo).length === 0) 
            return;
        else {
            setInvoiceNum(invoiceInfo?.invoiceNum);
            setPostcode(invoiceInfo?.post.postcode);
            setAmount(invoiceInfo?.amount);
            setClientName(invoiceInfo?.post.client.clientName);
            setInvoiceDate(dayjs(invoiceInfo?.invoiceDate));
        }
        
    }, [invoiceInfo]);

    if(Object.keys(invoiceInfo).length === 0) return(<><div>No invoice selected</div></>);

    //console.log("Invoice Info: ", invoiceInfo);


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

        const updateInvoice : invoiceData = {
            invoiceId: invoiceInfo.invoiceId,
            invoiceNum: invoiceNum,
            post: {
                postId: invoiceInfo.post.postId,
                postcode: postcode,
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
            settlementDate: null,
            statementId: null,
            chequeId: null,
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
                <div style={{height:'500px', width:'100%'}} className="flex flex-row gap-50 justify-center content-stretch">
                    <ShowcaseSection title="Contact Form" className="!p-6.5 w-full h-full">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4.5 flex flex-row gap-4.5">
                                <InputGroup
                                    label="Invoice No. "
                                    type="text"
                                    placeholder="Enter invoice number"
                                    value={invoiceNum}
                                    handleChange={(e) => {
                                        setInvoiceNum(e.target.value);
                                    }}
                                    className="w-full xl:w-5/12" // 40% width on extra-large screens
                                />

                                <InputGroup
                                    label="Postcode"
                                    type="text"
                                    placeholder="Enter postcode"
                                    value={postcode}
                                    handleChange={(e) => {
                                        setPostcode(e.target.value);
                                    }}
                                    className="w-full xl:w-5/12" // 20% width on extra-large screens
                                />

                                
                            </div>
                            <div className="mb-4.5 flex flex-row gap-4.5">
                                <InputGroup
                                    label="Client Name"
                                    type="text"
                                    placeholder="Enter client number"
                                    value={clientName}
                                    handleChange={(e) => {
                                        setClientName(e.target.value);
                                    }}
                                    className="w-full xl:w-5/12" // 40% width on extra-large screens
                                />

                                <InputGroup
                                    label="Amount"
                                    type="number"
                                    placeholder="Enter amount"
                                    value={amount.toString()}
                                    handleChange={(e) => {
                                        setAmount(+e.target.value);
                                    }}
                                    className="w-full xl:w-5/12" // 20% width on extra-large screens
                                />
                            </div>
                            <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                            <div className="w-full xl:w-6/12">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <MuiDatePicker
                                    title="Invoice Date"
                                    label="Invoice Date"
                                    value={dayjs(invoiceDate)}
                                    onChange={(e) => {
                                        setInvoiceDate(e as Dayjs);
                                    }}
                                />
                            </LocalizationProvider>
                                {/* <DatePickerThree 
                                    label="Invoice Date" 
                                    value={invoiceDate.toString()}
                                    handleChange={(e) => {
                                        
                                        setInvoiceDate(e.target.value);
                                    }}/> */}
                            </div>
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
                            <Button
                                label="Change"
                                variant="green"
                                shape="full"
                                size="default"
                                type="submit"
                                icon={<CheckIcon className="fill-white" />}
                                onClick={() => {
                                    
                                }}
                            />
                        </form>
                    </ShowcaseSection>
                </div>
            </DialogContent>
            <DialogContent>
                
            </DialogContent>
        </Dialog>
    </>
    );
};

export default InvoiceEditPopUp;
