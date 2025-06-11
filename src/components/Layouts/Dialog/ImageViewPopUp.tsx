"use client";
import React from "react";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Image } from "@heroui/image";

// type InvoiceInfoType = {
//     invoiceNum: string;
//     invoiceDate: string;
//     clientName: string;
//     amount: number;
//     status: string;
//     postcode: string;
//     settlementDate: string;
// }

type ImageViewPopUpPropsType = {
    image: string;
    open: boolean;
    setOpen: any;
}



function ImageViewPopUp ({ image, open, setOpen}: ImageViewPopUpPropsType){

    useEffect(() => {
        
    }, []);

    
    //console.log("Pop up opened: ", invoiceNum);
    const closePopUp = ()=> {
        setOpen(false);
    }

    
    return (
    <>
        <Dialog 
            open={open} onClose={setOpen}
            maxWidth={"xl"} aria-labelledby="alert-dialog-title" 
            aria-describedby="alert-dialog-description">
            <DialogTitle> Cheque Preview <IconButton onClick={closePopUp} style={{float:'right'}}><CloseIcon ></CloseIcon></IconButton> </DialogTitle>
            <DialogContent>
                <Image 
                    src={image}
                    alt="Cheque Image"
                    // width="auto"
                    // height="auto"
                    style={{ opacity: 1}}
                    />
            </DialogContent>
        </Dialog>
    </>
    );
};

export default ImageViewPopUp;
