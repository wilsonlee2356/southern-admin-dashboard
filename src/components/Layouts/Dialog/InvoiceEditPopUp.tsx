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
import { invoiceData, invoiceCheques, post } from "@/types/ObjectTypes/InvoiceType";
import { CombinedService } from "@/app/api/invoice";
import MuiDatePicker from "@/components/FormElements/DatePicker/MuiDatePicker";
import AutoCompleteWithSelectorButton from "@/components/FormElements/AutoCompletes/AutoCompleteWithSelectorButton";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useAuthenticatedRequest } from "@/lib/auth";
import { usePostClientContent } from "@/utils/post-client-content";

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
    postArray: post[];
}



function InvoiceEditPopUp ({ title, open, onClose, invoiceInfo, postArray }: InvoiceEditPopUpPropsType){

    const [invoiceNum, setInvoiceNum] = React.useState<string>("");
    const [postcode, setPostcode] = React.useState<string>("");
    const [amount, setAmount] = React.useState<number>(0);
    const [clientName, setClientName] = React.useState<string>("");
    const [fullName, setFullName] = React.useState<string>("");
    const [buildingAddress, setBuildingAddress] = React.useState<string>("");
    const [streetAddress, setStreetAddress] = React.useState<string>("");
    const [address, setAddress] = React.useState<string>("");
    const [invoiceDate, setInvoiceDate] = React.useState<Dayjs>(dayjs(new Date()));
    const [pdfSrc, setPdfSrc] = React.useState<string>("");
    const [invoiceCheques, setInvoiceCheques] = useState<invoiceCheques[]>([]);

    const [filteredPosts, setFilteredPosts] = useState<post[]>([]);
    const [pdfViewPopUp, setPdfViewPopUp] = React.useState<boolean>(false);
    const [loadingInvoiceCheques, setLoadingInvoiceCheques] = useState<boolean>(false);
    const [loadingCheques, setLoadingCheques] = useState<boolean>(false);

    const [dataGridLoaded, setDataGridLoaded] = React.useState<boolean>(false);
    const [postSelectArray, setPostSelectArray] = useState<{key: string, name: string}[]>([]);

    const { makeAuthenticatedRequest } = useAuthenticatedRequest();

    const { setInvoiceData } = usePostClientContent();

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
            setInvoiceCheques([]);
            setLoadingInvoiceCheques(true);
            CombinedService.get_invoice_cheque_by_invoice_id(invoiceInfo.invoiceId, makeAuthenticatedRequest).then((res) => {
                            console.log("Fetched invoice cheques: ", res);
                            if(res[0]) {
                                setLoadingInvoiceCheques(false);
                                const invoiceChequesList = res.map((item: any) => ({
                                    invoice: {
                                        invoiceId: item[0],
                                        invoiceNum: undefined,
                                        post: undefined,
                                        invoiceDate: undefined,
                                        amount: undefined,
                                        paidAmount: undefined,
                                        isPaid: undefined,
                                        isPending: undefined,
                                        settlementDate: undefined,
                                        statementId: undefined,
                                        invoiceChequesList: [],
                                        createDate: undefined,
                                        updateDate: undefined
                                    },
                                    cheque: {
                                        chequeId: item[5],
                                        base64StringChequeCopy: undefined,
                                        invoiceChequesList: []
                                    },
                                    amount: item[1],
                                    paymentDate: item[3]
                                }));
                                setInvoiceCheques(invoiceChequesList);
                                console.log("Invoice Cheques List: ", invoiceChequesList);
                                // setInvoiceCheques(res.invoiceChequesList);
                            } else {
                                console.log("No invoice cheques found for this invoice.");
                                setLoadingInvoiceCheques(false);
                            }
                            
                        }).catch((err) => {
                            console.error("Error fetching invoice cheque: ", err);
                            setLoadingInvoiceCheques(false);
                        });
            
        }
        
    }, [invoiceInfo]);

    useEffect(() => {
        console.log("Loading cheque",loadingCheques);
    }, [loadingCheques]);

    useEffect(() => {
        console.log("dataGridLoaded updated: ", dataGridLoaded);

      }, [dataGridLoaded]);

    useEffect(() => {
        console.log("Post array: ", postArray);
        console.log("invoiceInfo: ", invoiceInfo);
        if(Object.keys(invoiceInfo).length !== 0 && postArray.length > 0){
            console.log("invoiceInfo : ", postArray);
            let newFilteredPosts = postArray.filter((post) => post.client.clientId === invoiceInfo.post.client.clientId);
            setFilteredPosts(newFilteredPosts);
            const postcodeArr = newFilteredPosts.map((item) => ({
                key: item.postId.toString(),
                name: item.postcode,
            }));
            setPostSelectArray(postcodeArr);
        }
    }, [invoiceInfo, postArray]);

    useEffect(() => {
        filteredPosts.map((item) => {
            if(postcode === item.postcode) {
                setBuildingAddress(item.buildingAddress);
                setStreetAddress(item.streetAddress);
            }
        });
    }, [postcode]);

    if(Object.keys(invoiceInfo).length === 0) return(<><div></div></>);

    const setChequeCopy = (chequeId: number, newChequeCopy: string) => {
        const newInvoiceCheque = invoiceCheques.map(invoiceCheque => invoiceCheque.cheque.chequeId === chequeId ? 
            {
            ...invoiceCheque,
            cheque: {
              ...invoiceCheque.cheque,
              base64StringChequeCopy: newChequeCopy,
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

    const clearData = () => {
        setInvoiceNum("");
        setPostcode("");
        setAmount(0);
        setClientName("");
        setFullName("");
        setAddress("");
        setBuildingAddress("");
        setStreetAddress("");
        setInvoiceDate(dayjs(new Date()));
        setPdfSrc("");
        setInvoiceCheques([]);
        setFilteredPosts([]);

    };

    //console.log("Pop up opened: ", invoiceNum);
    const closePopUp = ()=> {
        onClose(false);
    }

    const submit = () => {
        // e.preventDefault();
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
                isEnded: invoiceInfo.post.isEnded,
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
            isPending: false,
            amount: amount,
            paidAmount: invoiceInfo.paidAmount,
            settlementDate: invoiceInfo.settlementDate,
            statementId: invoiceInfo.statementId,
            createDate: invoiceInfo.createDate,
            updateDate: newDate,
        };

        console.log("Sending updateInvoice:", JSON.stringify(invoice, null, 2));
        closePopUp();
        CombinedService.update_invoice_details(invoiceInfo.invoiceId, invoice, makeAuthenticatedRequest).then((res) => {
            if(res.invoiceId) {
                console.log("Updated invoice: ", res);
                setInvoiceData((prevData: invoiceData[]) => {
                    return prevData.map((item: invoiceData) => {
                        if (item.invoiceId === res.invoiceId) {
                            return { ...item, ...res };
                        }
                        return item;
                    });
                });
                
                // updateInvoiceData(); // Trigger data update
                
            }
        });
        // setInvoiceCheques([]);
        
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
            <DialogTitle>{title} <IconButton onClick={()=>{closePopUp();clearData();}} style={{float:'right'}}><CloseIcon ></CloseIcon></IconButton> </DialogTitle>
            <DialogContent>
                <div style={{height:'700px', width:'100%'}} className="flex flex-row gap-50 justify-left items-start content-stretch">
                    {/* <ShowcaseSection title="Contact Form" className="!p-6.5 w-full h-full "> */}
                        <form>
                            <div className="w-xl h-full flex flex-row gap-4.5">
                                <div className="flex flex-col gap-4.5 justify-start items-start content-stretch">
                                    <label className="text-body-lg font-bold text-dark">Invoice Information</label>
                                    <div className="mb-4.5 flex flex-row gap-4.5">
                                        
                                        <InputGroup
                                            label="Invoice No. "
                                            type="text"
                                            placeholder="Enter invoice number"
                                            value={invoiceNum}
                                            handleChange={(e) => {
                                                setInvoiceNum(e.target.value);
                                            }}
                                            disabled
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
                                    <label className="text-body-lg font-bold text-dark">Post Information</label>
                                    <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                                        <AutoCompleteWithSelectorButton
                                            title="Postcode"
                                            placeholder="Enter Postcode"
                                            dataArr={postSelectArray}
                                            stateSetter={setPostcode}
                                            input={postcode}
                                        />
                                        {/* <InputGroup
                                            label="Postcode"
                                            type="text"
                                            placeholder="Enter postcode"
                                            value={postcode}
                                            handleChange={(e) => {
                                                setPostcode(e.target.value);
                                            }}
                                            className="w-full xl:w-5/12" // 20% width on extra-large screens
                                        /> */}
                                        <InputGroup
                                            label="Building Adress"
                                            type="text"
                                            placeholder="Enter building adress"
                                            value={buildingAddress}
                                            handleChange={(e) => {
                                                setBuildingAddress(e.target.value);
                                            }}
                                            className="w-full" // 20% width on extra-large screens
                                            disabled={true}
                                        />
                                        <InputGroup
                                            label="Street Address"
                                            type="text"
                                            placeholder="Enter street address"
                                            value={streetAddress}
                                            handleChange={(e) => {
                                                setStreetAddress(e.target.value);
                                            }}
                                            className="w-full" // 20% width on extra-large screens
                                            disabled={true}
                                        />
                                        
                                    </div>
                                    <label className="text-body-lg font-bold text-dark">Client Information</label>
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
                                                    disabled={true}
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
                                                    disabled={true}
                                                />
                                                
                                            </div>
                                            <TextAreaOne 
                                                label="Address" 
                                                placeholder="Enter Address" 
                                                value={address} 
                                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAddress(e.currentTarget.value)}
                                                disabled={true}/>
                                    </div>
                            </div>
                            <div className="w-1.5/2 h-full min-w-80">
                                <ChequeEditMuiDataGrid
                                    dataArray={invoiceCheques}
                                    setImageSrcToView={setPdfSrc}
                                    windowOpen={open}
                                    onClose={setPdfViewPopUp}
                                    dataGridLoaded={dataGridLoaded}
                                    setChequeCopy={setChequeCopy}
                                    loadingInvoiceCheques={loadingInvoiceCheques}
                                    setLoadingCheques={setLoadingCheques}
                                    setDataGridLoaded={setDataGridLoaded}
                                    // setInvoiceCheque={setInvoiceCheques}
                                />
                            </div>
                            </div>
                            <Button
                                className="mt-4 mb-4"
                                label="Change"
                                variant="green"
                                shape="full"
                                size="default"
                                type="button"
                                icon={<CheckIcon className="fill-white" />}
                                onClick={() => {
                                    submit();
                                    clearData();
                                }}
                                disabled={loadingCheques}
                            />
                        </form>
                </div>
            </DialogContent>
        </Dialog>
        <PdfViewPopUp
            pdf={pdfSrc}
            open={pdfViewPopUp}
            setOpen={setPdfViewPopUp}/>
    </>
    );
};

export default InvoiceEditPopUp;
