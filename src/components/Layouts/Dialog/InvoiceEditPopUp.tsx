"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui-elements/button";
import { CheckIcon } from "@/assets/icons";
import { Dialog, DialogContent, DialogContentText, DialogProps, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PdfViewPopUp from "./PdfViewPopUp";
import InputGroup from "@/components/FormElements/InputGroup";
import ChequeEditMuiDataGrid from "@/components/Tables/DataGrid/ChequeEditMuiDataGrid";
import { TextAreaOne } from "@/components/FormElements/InputGroup/TextAreaOne";
import { invoiceData, invoiceCheques } from "@/types/ObjectTypes/InvoiceType";
import { CombinedService } from "@/app/api/invoice";
import MuiDatePicker from "@/components/FormElements/DatePicker/MuiDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useAuthenticatedRequest } from "@/lib/auth";

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
    setDataArray: any;
    updateInvoiceData: any; // Optional prop to trigger data update

}



function InvoiceEditPopUp ({ title, open, onClose, invoiceInfo, setDataArray, updateInvoiceData }: InvoiceEditPopUpPropsType){

    const [invoiceNum, setInvoiceNum] = React.useState<string>("");
    const [postcode, setPostcode] = React.useState<string>("");
    const [amount, setAmount] = React.useState<number>(0);
    const [clientName, setClientName] = React.useState<string>("");
    const [fullName, setFullName] = React.useState<string>("");
    const [buildingAddress, setBuildingAddress] = React.useState<string>("");
    const [streetAddress, setStreetAddress] = React.useState<string>("");
    const [address, setAddress] = React.useState<string>("");
    const [invoiceDate, setInvoiceDate] = React.useState<Dayjs>(dayjs(new Date()));
    const [imageSrc, setImageSrc] = React.useState<string>("");
    const [invoiceCheques, setInvoiceCheques] = useState<invoiceCheques[]>([]);
    const [imageViewPopUp, setImageViewPopUp] = React.useState<boolean>(false);
    const [loadingCheques, setLoadingCheques] = useState<boolean>(false);

    const { makeAuthenticatedRequest } = useAuthenticatedRequest();

    useEffect(() => {
        if(invoiceInfo == null || invoiceInfo == undefined || Object.keys(invoiceInfo).length === 0) 
            return;
        else {
            setInvoiceNum(invoiceInfo.invoiceNum);
            setPostcode(invoiceInfo.post.postcode);
            setAmount(invoiceInfo.amount);
            setClientName(invoiceInfo.post.client.clientName);
            setFullName(toEmptyIfNull(invoiceInfo.post.client.fullName));
            setAddress(toEmptyIfNull(invoiceInfo.post.client.address));
            setInvoiceDate(dayjs(invoiceInfo.invoiceDate));
            setBuildingAddress(invoiceInfo.post.buildingAddress);
            setStreetAddress(invoiceInfo.post.streetAddress);
            setLoadingCheques(true);
            CombinedService.get_invoice_by_id(invoiceInfo.invoiceId, makeAuthenticatedRequest).then((res) => {
                console.log("Fetched invoice cheques: ", res.invoiceChequesList);
                setLoadingCheques(false);
                setInvoiceCheques(res.invoiceChequesList);
            }).catch((err) => {
                console.error("Error fetching invoice by id: ", err);
            });
        }
        
    }, [invoiceInfo]);

    if(Object.keys(invoiceInfo).length === 0) return(<><div></div></>);

    const setChequeCopy = (chequeId: number, newChequeCopy: string) => {
        const newInvoiceCheque = invoiceCheques.map(invoiceCheque => invoiceCheque.cheque.chequeId === chequeId ? 
            {
            ...invoiceCheque,
            cheque: {
              ...invoiceCheque.cheque,
              chequeCopy: newChequeCopy,
            }} : invoiceCheque
        );
        //console.log("new invoice cheque: ", newInvoiceCheque);
        setInvoiceCheques(newInvoiceCheque);
        //console.log("changed cheque: ", invoiceCheques);
    }
    //console.log("Invoice Info: ", invoiceInfo);
    const toEmptyIfNull = (value: string | null) => {
        return value === null ? "" : value;
    }

    //console.log("Pop up opened: ", invoiceNum);
    const closePopUp = ()=> {
        onClose(false);
    }

    const submit = () => {
        console.log("Handle submit");

        console.log("Invoice Number: ", invoiceNum);
        console.log("Postcode: ", postcode);
        console.log("Client Name: ", clientName);
        console.log("Amount: ", amount);
        console.log("Invoice Date: ", invoiceDate);
        
        const newDate = new Date();

        // \/ \/ \/ \/ \/ \/ \/ \/ UNCOMMENT

        const invoice : invoiceData = {
            invoiceId: invoiceInfo.invoiceId,
            invoiceNum: invoiceNum,
            post: {
                postId: invoiceInfo.post.postId,
                postcode: postcode,
                buildingAddress: buildingAddress,
                streetAddress: streetAddress,
                isEnded: false,
                client: {
                    clientId: invoiceInfo.post.client.clientId,
                    clientName: clientName,
                    fullName: fullName,
                    address: address,
                    createDate: invoiceInfo.post.client.createDate,
                    updateDate: newDate.toISOString(),
                },
                createDate: invoiceInfo.post.createDate,
                updateDate: newDate.toISOString(),
            },
            invoiceChequesList: invoiceCheques,
            invoiceDate: invoiceDate?.toDate(),
            isPaid: invoiceInfo.isPaid,
            amount: amount,
            paidAmount: invoiceInfo.paidAmount,
            settlementDate: invoiceInfo.settlementDate,
            statementId: invoiceInfo.statementId,
            createDate: invoiceInfo.createDate,
            updateDate: newDate,
        };

        console.log("Sending updateInvoice:", JSON.stringify(invoice, null, 2));

        CombinedService.update_invoice_details(invoiceInfo.invoiceId, invoice, makeAuthenticatedRequest).then((res) => {
            if(res) {
                console.log("Updated invoice: ", res);
                setDataArray((prevData: any) => {
                    return prevData.map((item: any) => {
                        if (item.invoiceId === invoiceInfo.invoiceId) {
                            return { ...item, ...invoice };
                        }
                        return item;
                    });
                });
                
                //updateInvoiceData(); // Trigger data update

                // closePopUp();
            }
        });
        
        // ^^^^^^^^^^^^^^Uncomment the following lines to update the invoice in the database

        // UPDATE_INVOICE_BY_ID(invoiceInfo.invoiceId, updateInvoice).then((res) => {
        // UPDATE_INVOICE_DETAILS(invoiceInfo.invoiceId, updateInvoice).then((res) => {
        //     console.log("Updated invoice: ", res);
        // }
        // ).catch((err) => {
        //     console.log("Error updating invoice: ", err);
        // }
        // );

    };
    return (
    <>
        <Dialog 
            open={open} onClose={onClose} fullWidth={true} 
            maxWidth={"xl"} aria-labelledby="alert-dialog-title" 
            aria-describedby="alert-dialog-description">
            <DialogTitle>{title} <IconButton onClick={closePopUp} style={{float:'right'}}><CloseIcon ></CloseIcon></IconButton> </DialogTitle>
            <DialogContent>
                <div style={{height:'500px', width:'100%'}} className="flex flex-row gap-50 justify-left items-start content-stretch">
                    {/* <ShowcaseSection title="Contact Form" className="!p-6.5 w-full h-full "> */}
                        <form>
                            <div className="w-xl h-full flex flex-row gap-4.5">
                                <div className="flex flex-col gap-4.5 justify-start items-start content-stretch">
                                    <label className="text-body-lg font-medium text-dark">Invoice Information</label>
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
                                            label="Amount"
                                            type="number"
                                            placeholder="Enter amount"
                                            value={amount.toString()}
                                            handleChange={(e) => {
                                                setAmount(+e.target.value);
                                            }}
                                            className="w-full xl:w-5/12" // 20% width on extra-large screens
                                        />

                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <MuiDatePicker
                                                title="Invoice Date"
                                                label="Invoice Date"
                                                value={dayjs(invoiceDate)}
                                                onChange={(e) => {
                                                    setInvoiceDate(e as Dayjs);
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                    <label className="text-body-lg font-medium text-dark">Client Information</label>
                                    <div className="flex flex-col">
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
                                                    label="Full Name"
                                                    type="text"
                                                    placeholder="Enter client's full number"
                                                    value={fullName}
                                                    handleChange={(e) => {
                                                        setFullName(e.target.value);
                                                    }}
                                                    className="w-full xl:w-5/12" // 40% width on extra-large screens
                                                />
                                                
                                            </div>
                                            <TextAreaOne 
                                                label="Address" 
                                                placeholder="Enter Address" 
                                                value={address} 
                                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAddress(e.currentTarget.value)}/>
                                    </div>
                                    <label className="text-body-lg font-medium text-dark">Post Information</label>
                                    <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                                        <InputGroup
                                            label="Postcode"
                                            type="text"
                                            placeholder="Enter postcode"
                                            value={postcode}
                                            handleChange={(e) => {
                                                setPostcode(e.target.value);
                                            }}
                                            className="w-full xl:w-5/12" // 20% width on extra-large screens
                                        />
                                        <InputGroup
                                            label="Building Adress"
                                            type="text"
                                            placeholder="Enter building adress"
                                            value={buildingAddress}
                                            handleChange={(e) => {
                                                setBuildingAddress(e.target.value);
                                            }}
                                            className="w-full xl:w-5/12" // 20% width on extra-large screens
                                        />
                                        <InputGroup
                                            label="Street Address"
                                            type="text"
                                            placeholder="Enter street address"
                                            value={streetAddress}
                                            handleChange={(e) => {
                                                setStreetAddress(e.target.value);
                                            }}
                                            className="w-full xl:w-5/12" // 20% width on extra-large screens
                                        />
                                        
                                    </div>
                            </div>
                            <div className="w-1.5/2 h-full min-w-80">
                                <ChequeEditMuiDataGrid
                                    dataArray={invoiceCheques}
                                    setImageSrcToView={setImageSrc}
                                    onClose={setImageViewPopUp}
                                    setChequeCopy={setChequeCopy}
                                    loadingCheques={loadingCheques}
                                />
                            </div>
                        </div>
                        <Button
                            label="Change"
                            variant="green"
                            shape="full"
                            size="default"
                            type="button"
                            icon={<CheckIcon className="fill-white" />}
                            onClick={() => {
                                submit();
                            }}
                        />
                        </form>
                </div>
            </DialogContent>
            <DialogContent>
                
            </DialogContent>
        </Dialog>
        <PdfViewPopUp
            pdf={imageSrc}
            open={imageViewPopUp}
            setOpen={setImageViewPopUp}/>
    </>
    );
};

export default InvoiceEditPopUp;
