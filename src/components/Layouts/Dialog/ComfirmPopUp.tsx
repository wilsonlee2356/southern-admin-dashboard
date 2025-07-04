"use client";
import React from "react";
import { Button } from "@heroui/button";
import { Dialog, DialogContent, DialogContentText, DialogProps, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


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
                <div className="flex flex-row gap-5 justify-center content-stretch">
                    <Button
                            className="w-1/2 fill-white"
                            radius="none"
                            color="default"
                            size="lg"
                            onPress={() => {
                                closePopUp();
                            }}>Cancel</Button>
                    <Button
                            className="w-1/2 bg-red-500 text-white fill-white"
                            radius="none"
                            color="danger"
                            size="lg"
                            onPress={() => {
                                functionToRun();
                                closePopUp();
                            }}>{confirmButtonText}</Button>
                </div>
            </DialogContent>
        </Dialog>
    </>
    );
};

export default ComfirmPopUp;
