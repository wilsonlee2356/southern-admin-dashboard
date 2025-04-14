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
    invoiceInfo: invoiceData | null;
}



function InvoiceEditPopUp ({ title, open, onClose, invoiceInfo }: InvoiceEditPopUpPropsType){
    const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
    const [invoiceNum, setInvoiceNum] = React.useState<string | undefined | null>(invoiceInfo?.invoiceNum);
    const [postcode, setPostcode] = React.useState<string | undefined | null>(invoiceInfo?.post.postcode);
    const [amount, setAmount] = React.useState<number | undefined | null>(invoiceInfo?.amount);
    const [clientName, setClientName] = React.useState<string | undefined | null>(invoiceInfo?.post.client.clientName);
    const [invoiceDate, setInvoiceDate] = React.useState<string | undefined | null>(invoiceInfo?.invoiceDate);


    const closePopUp = ()=> {
        onClose(false);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Handle submit");
        
    };
    return (
    <>
        <Dialog 
            open={open} onClose={onClose} fullWidth={true} 
            maxWidth={"xl"} aria-labelledby="alert-dialog-title" 
            aria-describedby="alert-dialog-description"
            scroll={scroll}>
            <DialogTitle>{title} <IconButton onClick={closePopUp} style={{float:'right'}}><CloseIcon ></CloseIcon></IconButton> </DialogTitle>
            <DialogContent>
                <div style={{height:'500px', width:'100%'}} className="flex flex-row gap-50 justify-center content-stretch">
                    <ShowcaseSection title="Contact Form" className="!p-6.5">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4.5 flex flex-row gap-4.5">
                                <InputGroup
                                    label="Invoice No. "
                                    type="text"
                                    placeholder="Enter invoice number"
                                    value={invoiceInfo?.invoiceNum}
                                    handleChange={() => {
                                    }}
                                    className="w-full xl:w-5/12" // 40% width on extra-large screens
                                />

                                <InputGroup
                                    label="Postcode"
                                    type="text"
                                    placeholder="Enter postcode"
                                    value={invoiceInfo?.post.postcode}
                                    handleChange={() => {
                                    }}
                                    className="w-full xl:w-2/12" // 20% width on extra-large screens
                                />

                                
                            </div>
                            <div className="mb-4.5 flex flex-row gap-4.5">
                                <InputGroup
                                    label="Client Name"
                                    type="text"
                                    placeholder="Enter invoice number"
                                    value={invoiceInfo?.post.client.clientId.toString()}
                                    handleChange={() => {
                                    }}
                                    className="w-full xl:w-5/12" // 40% width on extra-large screens
                                />

                                <InputGroup
                                    label="Amount"
                                    type="number"
                                    placeholder="Enter amount"
                                    value={invoiceInfo?.amount.toString()}
                                    handleChange={() => {
                                    }}
                                    className="w-full xl:w-2/12" // 20% width on extra-large screens
                                />
                            </div>
                            <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                            <div className="w-full xl:w-6/12">
                                <DatePickerThree label="Invoice Date" value={invoiceInfo?.invoiceDate}/>
                            </div>
                            {
                                invoiceInfo?.settlementDate ? (
                                    <div className="w-full xl:w-6/12">
                                        <DatePickerThree label="Settlement Date" value={invoiceInfo?.settlementDate}/>
                                    </div>
                                ) : null
                            }
                            
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
