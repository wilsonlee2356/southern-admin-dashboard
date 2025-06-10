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
                            }}>Delete</Button>
                </div>
            </DialogContent>
        </Dialog>
    </>
    );
};

export default ComfirmPopUp;
