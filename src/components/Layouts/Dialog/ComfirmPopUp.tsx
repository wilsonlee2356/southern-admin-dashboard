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
    message: string;
    open: boolean;
    onClose: any;
    functionToRun: any;
    confirmButtonText: string;
    // invoiceInfo: invoiceData;
    // setDataArray: any;
}



function ComfirmPopUp ({ title, message, open, onClose, functionToRun, confirmButtonText}: InvoiceEditPopUpPropsType){

    // const [invoiceNum, setInvoiceNum] = React.useState<string>("");
    // const [postcode, setPostcode] = React.useState<string>("");
    // const [amount, setAmount] = React.useState<number>(0);
    // const [clientName, setClientName] = React.useState<string>("");
    // const [invoiceDate, setInvoiceDate] = React.useState<Dayjs>(dayjs(new Date()));

    // useEffect(() => {
    //     if(invoiceInfo == null || invoiceInfo == undefined || Object.keys(invoiceInfo).length === 0) 
    //         return;
    //     else {
    //         setInvoiceNum(invoiceInfo?.invoiceNum);
    //         setPostcode(invoiceInfo?.post.postcode);
    //         setAmount(invoiceInfo?.amount);
    //         setClientName(invoiceInfo?.post.client.clientName);
    //         setInvoiceDate(dayjs(invoiceInfo?.invoiceDate));
    //     }
        
    // }, [invoiceInfo]);

    // if(Object.keys(invoiceInfo).length === 0) return(<><div>No invoice selected</div></>);

    //console.log("Invoice Info: ", invoiceInfo);


    //console.log("Pop up opened: ", invoiceNum);
    const closePopUp = ()=> {
        onClose(false);
    }

    
    return (
    <>
        <Dialog 
            open={open} onClose={onClose}
            maxWidth={"xl"} aria-labelledby="alert-dialog-title" 
            aria-describedby="alert-dialog-description">
            <DialogTitle>{title} <IconButton onClick={closePopUp} style={{float:'right'}}><CloseIcon ></CloseIcon></IconButton> </DialogTitle>
            <DialogContent>
                <div style={{height:'50px', width:'300px'}} className="flex flex-row gap-50 justify-center content-stretch">
                    {message}
                </div>
            </DialogContent>
            <DialogContent>
                <Button
                        label="Cancal"
                        variant="transparent"
                        shape="default"
                        size="default"
                        icon={<CheckIcon className="fill-white" />}
                        //disabled={!canSetFinish}
                        onClick={() => {
                          //setPopUpOpen(true);
                          closePopUp();
                        }}
                      />
                <Button
                        label={confirmButtonText}
                        variant="green"
                        shape="default"
                        size="default"
                        icon={<CheckIcon className="fill-white" />}
                        //disabled={!canSetFinish}
                        onClick={() => {
                            functionToRun();
                            closePopUp();
                        }}
                        />
            </DialogContent>
        </Dialog>
    </>
    );
};

export default ComfirmPopUp;
