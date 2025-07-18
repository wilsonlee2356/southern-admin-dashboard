"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Button, ButtonGroup } from "@heroui/react";
import { InvoiceData } from "@/types/ObjectTypes/InvoiceType";

type StatementPopUpPropsType = {
    selectedData: InvoiceData[];
    open: boolean;
    setOpen: any;
}



function StatementViewPopUp ({ selectedData, open, setOpen }: StatementPopUpPropsType){

    const [seriousness, setSeriousness] = useState<number>(1);
    const [statementUpperParagraph, setStatementUpperParagraph] = useState<string>("");
    const [statementLowerParagraph, setStatementLowerParagraph] = useState<string>("");
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const header = "Dear [Receiver Namer],";
    const relaxedUpperParagraph = `Just a gentle nudge to let you know that we have a couple of invoices that are still pending payment.

For your convenience, I've attached the details of the unpaid invoices below:`;
    const concernedUpperParagraph = `Our records indicate that there are still some outstanding invoices from our previous transactions that remain unpaid.

Please find the breakdown of these invoices attached for your review:`;
    const urgingUpperParagraph = `We urgently need your attention regarding several unpaid invoices that are still outstanding, as per our records. This matter requires immediate action to avoid any further delays.

Attached below is the detailed breakdown of the unpaid invoices:`;

    const relaxedLowerParagraph = `*** Attached invoice for your reference ***

Please take a moment to review them when you get a chance. Let us know if you need any assistance or clarification.`;
    const concernedLowerParagraph = `*** Attached invoice for your reference ***

We kindly ask for your attention to settle these at your earliest convenience. Please reach out if you need any clarification or support.`;
    const urgingLowerParagraph = `*** Attached invoice for your reference ***\n\nWe respectfully request your immediate action to resolve these payments. Please confirm receipt of this message and let us know if there are any issues we can assist with.`;

    const signOff = `\nThank you and Regards,\n[Sender]\nSouthern Service Ltd.\nTel: 27628128`;

    useEffect(() => {
        if(open){
            let statementToShow = "";
            let totalOutstanding = 0;
            statementToShow = combineParagraph(header, relaxedUpperParagraph);
            setStatementUpperParagraph(statementToShow);
            selectedData.forEach((invoice)=>{
                totalOutstanding = totalOutstanding + (invoice.amount-invoice.paidAmount);
            });
            setTotalAmount(totalOutstanding);
        }
        
    }, [open]);
    
    useEffect(() => {
        let statementToShowUpper = "";
        let statementToShowLower = "";
        if(seriousness === 1){
            statementToShowUpper = combineParagraph(header, relaxedUpperParagraph);
            statementToShowLower = combineParagraph(relaxedLowerParagraph, signOff);
        } else if (seriousness === 2){
            statementToShowUpper = combineParagraph(header,concernedUpperParagraph);
            statementToShowLower = combineParagraph(concernedLowerParagraph, signOff);
        } else {
            statementToShowUpper = combineParagraph(header, urgingUpperParagraph);
            statementToShowLower = combineParagraph(urgingLowerParagraph, signOff);
        }
        setStatementUpperParagraph(statementToShowUpper);
        setStatementLowerParagraph(statementToShowLower);
    }, [seriousness]);

    const combineParagraph = (paragraph1: string, paragraph2: string) => {
        return paragraph1 + '\n' + paragraph2;
    }
    
    //console.log("Pop up opened: ", invoiceNum);
    const closePopUp = ()=> {
        setTotalAmount(0);
        setOpen(false);
    }

    
    return (
    <>
        <Dialog 
            open={open} onClose={setOpen}
            maxWidth={"xl"} aria-labelledby="alert-dialog-title" 
            aria-describedby="alert-dialog-description">
            <DialogTitle> Statement Preview <IconButton onClick={closePopUp} style={{float:'right'}}><CloseIcon ></CloseIcon></IconButton> </DialogTitle>
            <DialogContent>
                <div style={{height:'500px', width:'100%'}} className="flex flex-col gap-5 mb-10">
                    <ButtonGroup>
                        <Button className={(seriousness===1)?"bg-blue text-white":"bg-gray-300 text-white"} variant="bordered" onPress={()=>setSeriousness(1)}>Normal</Button>
                        <Button className={(seriousness===2)?"bg-blue text-white":"bg-gray-300 text-white"} onPress={()=>setSeriousness(2)}>Serious</Button>
                        <Button className={(seriousness===3)?"bg-blue text-white":"bg-gray-300 text-white"} variant="bordered" onPress={()=>setSeriousness(3)}>Very Serious</Button>
                    </ButtonGroup>
                    <p className="text-dark w-full" style={{ whiteSpace: 'pre-line', textWrap: 'wrap', marginLeft: 'auto', marginRight: 'auto' }}>{statementUpperParagraph}</p>
                    <table
                        className="w-full"
                        style={{
                        borderCollapse: 'collapse',
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '14px',
                        }}
                    >
                        <thead>
                        <tr>
                            <th
                            style={{
                                border: '1px solid #000',
                                padding: '8px',
                                textAlign: 'center',
                            }}
                            scope="col"
                            >
                            Invoice Date
                            </th>
                            <th
                            style={{
                                border: '1px solid #000',
                                padding: '8px',
                                textAlign: 'center',
                            }}
                            scope="col"
                            >
                            Invoice Number
                            </th>
                            <th
                            style={{
                                border: '1px solid #000',
                                padding: '8px',
                                textAlign: 'center',
                            }}
                            scope="col"
                            >
                            Invoice Amount
                            </th>
                            <th
                            style={{
                                border: '1px solid #000',
                                padding: '8px',
                                textAlign: 'center',
                            }}
                            scope="col"
                            >
                            Location
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {selectedData.map((invoice: InvoiceData) => {
                            const invoiceDate = new Date(invoice.invoiceDate);
                            const dateString = `${invoiceDate.getDate()}-${invoiceDate.getMonth()}-${invoiceDate.getFullYear()}`;
                            return (
                            <tr key={`invoice-${invoice.invoiceId}`}>
                                <td
                                style={{
                                    border: '1px solid #000',
                                    padding: '8px',
                                    textAlign: 'center',
                                }}
                                >
                                {dateString}
                                </td>
                                <td
                                style={{
                                    border: '1px solid #000',
                                    padding: '8px',
                                    textAlign: 'center',
                                }}
                                >
                                {invoice.invoiceNum}
                                </td>
                                <td
                                style={{
                                    border: '1px solid #000',
                                    padding: '8px',
                                    textAlign: 'center',
                                }}
                                >
                                {invoice.amount - invoice.paidAmount}
                                </td>
                                <td
                                style={{
                                    border: '1px solid #000',
                                    padding: '8px',
                                    textAlign: 'center',
                                }}
                                >
                                {invoice.post.buildingAddress}
                                </td>
                            </tr>
                            );
                        })}
                        </tbody>
                        <tfoot>
                        <tr key="footer-row">
                            <th
                            style={{
                                border: '1px solid #000',
                                padding: '8px',
                                textAlign: 'center',
                            }}
                            scope="row"
                            ></th>
                            <th
                            style={{
                                border: '1px solid #000',
                                padding: '8px',
                                textAlign: 'center',
                            }}
                            scope="row"
                            >
                            Total:
                            </th>
                            <td
                            style={{
                                border: '1px solid #000',
                                padding: '8px',
                                textAlign: 'center',
                            }}
                            >
                            ${totalAmount}
                            </td>
                            <th
                            style={{
                                border: '1px solid #000',
                                padding: '8px',
                                textAlign: 'center',
                            }}
                            ></th>
                        </tr>
                        </tfoot>
                    </table>
                    <p className="text-dark w-full" style={{ whiteSpace: 'pre-line', marginLeft: 'auto', marginRight: 'auto' }}>{statementLowerParagraph}</p>
                </div>
            </DialogContent>
        </Dialog>
    </>
    );
};

export default StatementViewPopUp;
