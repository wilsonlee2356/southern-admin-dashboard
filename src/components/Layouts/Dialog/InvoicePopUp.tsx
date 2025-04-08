"use client";
import React, { JSX } from "react";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogContentText, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type InvoicePopUpPropsType = {
    title: string;
    open: boolean;
    onClose: any;
    
}



function InvoicePopUp ({ title, open, onClose }: InvoicePopUpPropsType){
    const closePopUp = ()=> {
        onClose(false);
    }
    return (
    <>
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title} <IconButton onClick={closePopUp} style={{float:'right'}}><CloseIcon ></CloseIcon></IconButton> </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    This is the invoice pop-up content.
                </DialogContentText>
            </DialogContent>
        </Dialog>
    </>
    );
};

export default InvoicePopUp;
