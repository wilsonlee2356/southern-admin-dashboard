"use client";
import React, { JSX, useState } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui-elements/button";
import { CheckIcon, UploadIcon } from "@/assets/icons";
import { Dialog, DialogContent, DialogContentText, DialogProps, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadButton from "@/components/ui-elements/upload-button";
import SimpleMuiDataGrid from "@/components/Tables/DataGrid/SimpleMuiDataGrid";
import FilePreviewWindow from "@/components/ui-elements/FilePreviewWindow";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import AutoCompleteWithSelectorButton from "@/components/FormElements/AutoCompletes/AutoCompleteWithSelectorButton";
import MuiDatePicker from "@/components/FormElements/DatePicker/MuiDatePicker";
import { TextAreaOne } from "@/components/FormElements/InputGroup/TextAreaOne";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from 'dayjs';
import { client, post, invoiceData, invoiceDataOutput } from "@/types/ObjectTypes/InvoiceType";
import { CombinedService } from "@/app/api/invoice";


type AutoCompleteArrayType = {
    key: string;
    name: string;
}

type InvoiceCreatePopUpPropsType = { 
    open: boolean;
    onClose: any;
    setUpdateDataNeeded: any;
    invoiceArray: AutoCompleteArrayType[]; // Pass data as a prop instead of fetching here
    clientArray: AutoCompleteArrayType[];
    postArray: AutoCompleteArrayType[];
}



function InvoiceCreatePopUp ({ open, onClose, setUpdateDataNeeded, invoiceArray, clientArray, postArray }: InvoiceCreatePopUpPropsType){
    const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
    //const [invoiceDate, setInvoiceDate] = useState<Dayjs | null>(null);
    const [chequeFile, setChequeFile] = React.useState<File | null>(null);
    const [statementFile, setStatementFile] = React.useState<File | null>(null);

    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [clientName, setClientName] = useState("");
    const [fullName, setFullName] = useState("");
    const [postcode, setPostcode] = useState("");
    const [address, setAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [invoiceDate, setInvoiceDate] = useState<Dayjs | null>(dayjs());

    

    React.useEffect(() => {
        if (open) {
        const { current: descriptionElement } = descriptionElementRef;
        if (descriptionElement !== null) {
            descriptionElement.focus();
        }
        }
    }, [open]);

    const descriptionElementRef = React.useRef<HTMLElement>(null);

    const closePopUp = ()=> {
        onClose(false);
    }

    const handleClear = () => {
        setInvoiceNumber("");
        setClientName("");
        setPostcode("");
        setAddress("");
        setAmount("");
        setInvoiceDate(dayjs());
    }

    const handleAdd = () => {
          const updateInvoice : invoiceDataOutput = {
            invoiceNum: invoiceNumber,
            post: {
              postcode: postcode,
              address: address,
              client: {
                clientName: clientName,
                fullName: fullName,
              },
            },
            paidAmount: 0,
            invoiceDate: invoiceDate?.toDate(),
            amount: parseFloat(amount),
            settlementDate: null,
            statementId: null,
            chequeId: null,
          };
          CombinedService.create_invoice(updateInvoice).then((response) => {
            console.log("Invoice created:", response);
            //getNewlyInsertedInvoice(response.invoiceId);
            if(response){
              //update List
              setUpdateDataNeeded(true);

            }
            
          }).catch((error) => {
            console.error("Error creating invoice:", error);
          });
      }


    // const invoiceNumArr = dataArray.map((item) => ({ 
    // key: item.invoiceId.toString(),
    // name: item.invoiceNum.toString(), }));
    // const clientNameArr = clientData.map((item) => ({
    //     key: item.clientId.toString(),
    //     name: item.clientName,
    // }));
    // const postcodeArr = postData.map((item) => ({
    //     key: item.postId.toString(),
    //     name: item.postcode,
    // }));
    return (
    <>
        <Dialog 
            open={open} onClose={onClose} fullWidth={true} 
            maxWidth={"xl"} aria-labelledby="alert-dialog-title" 
            aria-describedby="alert-dialog-description"
            scroll={scroll}>
            <DialogTitle> Create Invoice <IconButton onClick={closePopUp} style={{float:'right'}}><CloseIcon ></CloseIcon></IconButton> </DialogTitle>
            <DialogContent>
                <div style={{height:'600px', width:'100%'}} className="flex-col mb-10 justify-center content-stretch">
                    <div className="flex flex-col gap-5">
                        <AutoCompleteWithSelectorButton title="Invoice Number" placeholder="Enter Invoice Number" dataArr={invoiceArray} input={invoiceNumber} stateSetter={setInvoiceNumber}/>
                        <AutoCompleteWithSelectorButton title="Client Name" placeholder="Enter Client Name" dataArr={clientArray} input={clientName} stateSetter={setClientName}/>
                        <AutoCompleteWithSelectorButton title="Client Name" placeholder="Enter Full Client Name" dataArr={clientArray} input={fullName} stateSetter={setFullName}/>
                        <AutoCompleteWithSelectorButton title="Postcode" placeholder="Enter Postcode" dataArr={postArray} input={postcode} stateSetter={setPostcode}/>
                        <TextAreaOne label="Address" placeholder="Enter Address" value={address} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAddress(e.currentTarget.value)}/>
                        <AutoCompleteWithSelectorButton title="Amount" placeholder="Enter Amount" dataArr={[]} input={amount} stateSetter={setAmount}/>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MuiDatePicker
                                title="Invoice Date"
                                label="Invoice Date"
                                value={invoiceDate}
                                onChange={(newValue) => setInvoiceDate(newValue)}
                            />
                        </LocalizationProvider>

                    
                    </div>
                    <div className="flex flex-col gap-5 mt-10 xl:flex-row xl:justify-center">
                       <Button
                            label="Clear"
                            variant="outlinePrimary"
                            shape="full"
                            size="default"
                            icon={<CloseIcon />}
                            onClick={() => {
                                handleClear();
                            }}
                        />

                        <Button
                            label="Create"
                            variant="green"
                            shape="full"
                            size="default"
                            icon={<CheckIcon className="fill-white" />}
                            onClick={() => {
                                handleAdd();
                                handleClear();
                                onClose(false);
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
                    </div>
                    {/* <div className="flex flex-col gap-4.5 xl:flex-row">
                        
                    </div> */}
                    {/* <div className="mb-1 flex flex-col gap-4.5 xl:flex-row">
                    <div className="w-full xl:w-4/12">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MuiDatePicker
                            title="Invoice Date"
                            label="Invoice Date"
                            value={invoiceDate}
                            onChange={(newValue) => setInvoiceDate(newValue)}
                        />
                        </LocalizationProvider>
                    </div>
                    </div> */}
        
                    
                </div>
            </DialogContent>
            {/* <DialogContent>
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
            </DialogContent> */}
        </Dialog>
    </>
    );
};

export default InvoiceCreatePopUp;
