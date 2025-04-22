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
import { UPDATE_INVOICE_BY_ID } from "@/app/api/invoice";
import { Console } from "console";

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
}



function InvoiceEditPopUp ({ title, open, onClose, invoiceInfo }: InvoiceEditPopUpPropsType){

    if(Object.keys(invoiceInfo).length === 0) return(<><div>No invoice selected</div></>);

    //console.log("Invoice Info: ", invoiceInfo);
    const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
    const [invoiceNum, setInvoiceNum] = React.useState<string>(invoiceInfo?.invoiceNum);
    const [postcode, setPostcode] = React.useState<string>(invoiceInfo?.post.postcode);
    const [amount, setAmount] = React.useState<number>(invoiceInfo?.amount);
    const [clientName, setClientName] = React.useState<string>(invoiceInfo?.post.client.clientName);
    const [invoiceDate, setInvoiceDate] = React.useState<string>(invoiceInfo?.invoiceDate.toString());

//     useEffect(() => {
//         console.log({ invoiceDate });
//   }, [invoiceDate]);

    //console.log("Pop up opened: ", postcode);
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
        const updateInvoice : invoiceData = {
            invoiceId: invoiceInfo.invoiceId,
            invoiceNum: invoiceNum,
            post: {
                postId: invoiceInfo.post.postId,
                client: {
                    clientId: invoiceInfo.post.client.clientId,
                    clientName: clientName,
                    fullName: invoiceInfo.post.client.fullName,
                    createDate: invoiceInfo.post.client.createDate,
                    updateDate: invoiceInfo.post.client.updateDate,
                    postlist: null
                },
                postcode: postcode,
                createDate: invoiceInfo.post.createDate,
                updateDate: invoiceInfo.post.updateDate
            },
            invoiceDate: new Date(invoiceDate),
            amount: amount,
            settlementDate: null,
            statementId: null,
            chequeId: null,
            createDate: invoiceInfo.createDate,
            updateDate: new Date()
        };
        UPDATE_INVOICE_BY_ID(invoiceInfo.invoiceId, updateInvoice).then((res) => {
            console.log("Updated invoice: ", res);
        }
        ).catch((err) => {
            console.log("Error updating invoice: ", err);
        }
        );
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
                                    className="w-full xl:w-2/12" // 20% width on extra-large screens
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
                                    className="w-full xl:w-2/12" // 20% width on extra-large screens
                                />
                            </div>
                            <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                            <div className="w-full xl:w-6/12">
                                <DatePickerThree 
                                    label="Invoice Date" 
                                    value={invoiceDate.toString()}
                                    handleChange={(e) => {
                                        
                                        setInvoiceDate(e.target.value);
                                    }}/>
                            </div>
                            {
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
