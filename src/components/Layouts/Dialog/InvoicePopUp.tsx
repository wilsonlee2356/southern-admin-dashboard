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
import { invoiceData, transaction, PaidAmountsType } from "@/types/ObjectTypes/InvoiceType";
import { CombinedService } from "@/app/api/invoice";

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
    const [paidAmounts, setPaidAmounts] = useState<PaidAmountsType[]>([]);

    useEffect(() => {
        console.log("Paid amount:", paidAmounts);
    }, [paidAmounts]);

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
                <div style={{height:'100px', width:'100%'}} className="flex flex-row gap-4 content-stretch">
                    <div className="flex flex-col gap-4.5">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MuiDatePicker
                                title="Payment Date"
                                label="Payment Date"
                                value={invoiceDate}
                                onChange={(newValue) => setInvoiceDate(newValue)}
                            />
                        </LocalizationProvider>
                        {/* <AutoCompleteWithoutSelectorButton
                            title="Amount"
                            placeholder="Amount"
                            dataArr={[]}
                            stateSetter={setAmount}
                            input={amount}
                        /> */}
                    </div>
                    <div className="mb-1.5 flex flex-col gap-2">
                        <div className="flex flex-row gap-2">
                            <DialogContentText id="alert-dialog-description">
                                <span>Cheque Upload</span>
                            </DialogContentText>
                            <UploadButton width={200} setFile={setChequeFile}/>
                        </div>
                        {/* <FilePreviewWindow source={undefined} width={300} height={300}/> */}
                    </div>
                    {/* <div className="mb-1.5 flex flex-col gap-2">
                        <div className="flex flex-row gap-2 xl:flex-row">
                            <DialogContentText id="alert-dialog-description">
                                <span>Statement Upload</span>
                            </DialogContentText>
                            <UploadButton width={200} setFile={setStatementFile}/>
                        </div>
                        <FilePreviewWindow source={undefined} width={300} height={300}/>
                    </div> */}
                    
                </div>
            </DialogContent>
            <DialogContent dividers={scroll === 'paper'}>
                <DialogContentText id="alert-dialog-description">
                    <span className="text-dark">Selected invoices</span>
                </DialogContentText>
                <DialogContent style={{width: '100%'}} ref={descriptionElementRef} tabIndex={-1}>
                    <SimpleMuiDataGrid dataArray={dataArray} paidAmounts={paidAmounts} setPaidAmounts={setPaidAmounts}/>
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
                        console.log("Paid Amounts: ", paidAmounts);
                        CombinedService.create_cheque({
                            chequeId: 0, // Assuming chequeId is auto-generated
                            chequeCopy: null,
                            transactionsList: [],
                            }).then((cheque) => {
                                console.log("Cheque created:", cheque);
                                let transactionsArr: transaction[] = [];
                                paidAmounts.map((item) => {
                                    transactionsArr.push({
                                        invoice: {
                                            invoiceId: item.invoiceId,
                                            invoiceNum: dataArray.find((invoiceInfo: invoiceData) => invoiceInfo.invoiceId === item.invoiceId)?.invoiceNum || "",
                                            post: dataArray.find((invoiceInfo: invoiceData) => invoiceInfo.invoiceId === item.invoiceId)?.post || null,
                                            invoiceDate: new Date(),
                                            amount: 0,
                                            settlementDate: null, // Assuming this is set later
                                            statementId: null, // Assuming this is set later
                                            createDate: new Date(),
                                            updateDate: new Date(),
                                        },
                                        cheque: {
                                            chequeId: cheque.chequeId, // Use the created cheque's ID
                                            chequeCopy: null,
                                            transactionsList: [],
                                        }, // Use the created cheque's ID
                                        amount: item.amount,
                                        paymentDate: invoiceDate ? invoiceDate.toDate() : new Date(),
                                    })
                                });
                                CombinedService.create_transaction(transactionsArr).then((transactions) => {
                                    console.log("Transactions created:", transactions);
                                    // setDataArray((prevData: any) => {
                                    //     return prevData.map((item: any) => {
                                    //         dataArray.map((invoiceInfo: invoiceData) => {
                                    //             if (item.invoiceId === invoiceInfo.invoiceId) {
                                    //                 item.settlementDate = invoiceDate ? invoiceDate.toISOString() : null;
                                    //                 item.chequeId = cheque.chequeId;
                                    //             }
                                    //             return item;
                                    //         });
                                    //     });
                                    // });
                                }).catch((error) => {
                                    console.error("Error creating transactions:", error);
                                });
                            }).catch((error) => {
                                console.error("Error creating cheque:", error);
                            });
                        
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
