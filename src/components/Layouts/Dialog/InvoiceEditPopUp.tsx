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
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import { invoice } from "@/types/ObjectTypes/InvoiceType";

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
    invoiceInfo: invoice | null;
}



function InvoiceEditPopUp ({ title, open, onClose, invoiceInfo }: InvoiceEditPopUpPropsType){
    const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
    const [chequeFile, setChequeFile] = React.useState<File | null>(null);

    const [statementFile, setStatementFile] = React.useState<File | null>(null);


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
                                    value={invoiceInfo?.id}
                                    handleChange={() => {
                                    }}
                                    className="w-full xl:w-5/12" // 40% width on extra-large screens
                                />

                                <InputGroup
                                    label="Postcode"
                                    type="text"
                                    placeholder="Enter postcode"
                                    value={invoiceInfo?.postcode}
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
                                    value={invoiceInfo?.name}
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
                                <DatePickerOne label="Invoice Date" value={invoiceInfo?.date}/>
                            </div>
                            <div className="w-full xl:w-6/12">
                                <DatePickerOne label="Settlement Date" />
                            </div>
                            </div>
                        </form>
                    </ShowcaseSection>
                </div>
            </DialogContent>
            <DialogContent>
                <Button
                    label="Change"
                    variant="green"
                    shape="full"
                    size="default"
                    icon={<CheckIcon className="fill-white" />}
                    onClick={() => {
                        
                    }}
                />
            </DialogContent>
        </Dialog>
    </>
    );
};

export default InvoiceEditPopUp;
