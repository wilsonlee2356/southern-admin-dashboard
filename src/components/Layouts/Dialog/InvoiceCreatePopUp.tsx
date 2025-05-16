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
import MuiDatePicker from "@/components/FormElements/DatePicker/MuiDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { invoiceData } from "@/types/ObjectTypes/InvoiceType";

type InvoiceCreatePopUpPropsType = { 
    open: boolean;
    onClose: any;
}



function InvoiceCreatePopUp ({ open, onClose }: InvoiceCreatePopUpPropsType){
    const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
    const [invoiceDate, setInvoiceDate] = useState<Dayjs | null>(null);
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
            <DialogTitle> Create Invoice <IconButton onClick={closePopUp} style={{float:'right'}}><CloseIcon ></CloseIcon></IconButton> </DialogTitle>
            <DialogContent>
                <div style={{height:'500px', width:'120%'}} className="flex flex-row gap-50 justify-center content-stretch">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MuiDatePicker
                            title="Invoice Date"
                            label="Invoice Date"
                            value={invoiceDate}
                            onChange={(newValue) => setInvoiceDate(newValue)}
                        />
                    </LocalizationProvider>
                    <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                        <DialogContentText id="alert-dialog-description">
                            <span>Cheque Upload</span>
                        </DialogContentText>
                        <UploadButton width={300} setFile={setChequeFile}/>
                        <FilePreviewWindow source={undefined} width={300} height={300}/>
                    </div>
                    <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                        <DialogContentText id="alert-dialog-description">
                            <span>Statement Upload</span>
                        </DialogContentText>
                        <UploadButton width={300} setFile={setStatementFile}/>
                        <FilePreviewWindow source={undefined} width={300} height={300}/>
                    </div>
                </div>
            </DialogContent>
            <DialogContent>
                <Button
                    label="Create"
                    variant="green"
                    shape="full"
                    size="default"
                    icon={<CheckIcon className="fill-white" />}
                    onClick={() => {
                        // console.log("Invoice Date: ", invoiceDate);
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

export default InvoiceCreatePopUp;
