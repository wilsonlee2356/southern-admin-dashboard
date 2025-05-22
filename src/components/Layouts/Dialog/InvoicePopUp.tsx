"use client";
import React, { JSX, useState } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui-elements/button";
import { CheckIcon } from "@/assets/icons";
import { Dialog, DialogContent, DialogContentText, DialogProps, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadButton from "@/components/ui-elements/upload-button";
import SimpleMuiDataGrid from "@/components/Tables/DataGrid/SimpleMuiDataGrid";
import FilePreviewWindow from "@/components/ui-elements/FilePreviewWindow";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import AutoCompleteWithoutSelectorButton from "@/components/FormElements/AutoCompletes/AutoCompleteWithoutSelectorButton";
import MuiDatePicker from "@/components/FormElements/DatePicker/MuiDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { invoiceData } from "@/types/ObjectTypes/InvoiceType";

type InvoicePopUpPropsType = {
    title: string;
    open: boolean;
    onClose: any;
    dataArray: any;
    setDataArray: any;
}



function InvoicePopUp ({ title, open, onClose, dataArray, setDataArray }: InvoicePopUpPropsType){
    const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
    const [invoiceDate, setInvoiceDate] = useState<Dayjs | null>(null);
    const [amount, setAmount] = useState("");
    const [chequeFile, setChequeFile] = React.useState<File | null>(null);
    const [statementFile, setStatementFile] = React.useState<File | null>(null);


    const closePopUp = ()=> {
        onClose(false);
    }

    const descriptionElementRef = React.useRef<HTMLElement>(null);
    React.useEffect(() => {
        if (open) {
        const { current: descriptionElement } = descriptionElementRef;
        if (descriptionElement !== null) {
            descriptionElement.focus();
        }
        }
    }, [open]);
    return (
    <>
        <Dialog 
            open={open} onClose={onClose} fullWidth={true} 
            maxWidth={"xl"} aria-labelledby="alert-dialog-title" 
            aria-describedby="alert-dialog-description"
            scroll={scroll}>
            <DialogTitle>{title} <IconButton onClick={closePopUp} style={{float:'right'}}><CloseIcon ></CloseIcon></IconButton> </DialogTitle>
            <DialogContent>
                <div style={{height:'500px', width:'100%'}} className="flex flex-row gap-4 content-stretch">
                    <div className="flex flex-col gap-4.5">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MuiDatePicker
                                title="Invoice Date"
                                label="Invoice Date"
                                value={invoiceDate}
                                onChange={(newValue) => setInvoiceDate(newValue)}
                            />
                        </LocalizationProvider>
                        <AutoCompleteWithoutSelectorButton
                            title="Amount"
                            placeholder="Amount"
                            dataArr={[]}
                            stateSetter={setAmount}
                            input={amount}
                        />
                    </div>
                    <div className="mb-1.5 flex flex-col gap-2">
                        <div className="flex flex-row gap-2">
                            <DialogContentText id="alert-dialog-description">
                                <span>Cheque Upload</span>
                            </DialogContentText>
                            <UploadButton width={200} setFile={setChequeFile}/>
                        </div>
                        <FilePreviewWindow source={undefined} width={300} height={300}/>
                    </div>
                    <div className="mb-1.5 flex flex-col gap-2">
                        <div className="flex flex-row gap-2 xl:flex-row">
                            <DialogContentText id="alert-dialog-description">
                                <span>Statement Upload</span>
                            </DialogContentText>
                            <UploadButton width={200} setFile={setStatementFile}/>
                        </div>
                        <FilePreviewWindow source={undefined} width={300} height={300}/>
                    </div>
                    
                </div>
            </DialogContent>
            <DialogContent dividers={scroll === 'paper'}>
                <DialogContentText id="alert-dialog-description">
                    <span className="text-dark">Selected invoices</span>
                </DialogContentText>
                <DialogContent style={{width: '100%'}} ref={descriptionElementRef} tabIndex={-1}>
                    <SimpleMuiDataGrid dataArray={dataArray} />
                </DialogContent>
            </DialogContent>
            <DialogContent>
                <Button
                    label="Set paid"
                    variant="green"
                    shape="full"
                    size="default"
                    icon={<CheckIcon className="fill-white" />}
                    onClick={() => {
                        console.log("Invoice Date: ", invoiceDate);
                        // if(invoiceDate !== null) {
                        //     setDataArray((prevData: any) => {
                        //     return prevData.map((item: any) => {
                        //         dataArray.map((invoiceInfo: invoiceData) => {
                        //             if (item.invoiceId === invoiceInfo.invoiceId) {
                        //                 item.settlementDate = invoiceDate.toISOString();
                        //                 //console.log(item);
                        //             }
                                    
                        //             return item;
                        //         }
                        //         );
                        //     });
                        // });
                        // }
                        
                    }}
                />
            </DialogContent>
        </Dialog>
    </>
    );
};

export default InvoicePopUp;
