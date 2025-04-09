"use client";
import React, { JSX } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui-elements/button";
import { CheckIcon } from "@/assets/icons";
import { Dialog, DialogContent, DialogContentText, DialogProps, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadButton from "@/components/ui-elements/upload-button";
import SimpleMuiDataGrid from "@/components/Tables/DataGrid/SimpleMuiDataGrid";

type InvoicePopUpPropsType = {
    title: string;
    open: boolean;
    onClose: any;
    dataArray: any;
    
}



function InvoicePopUp ({ title, open, onClose, dataArray }: InvoicePopUpPropsType){
    const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

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
                <div style={{height:'500px', width:'500px'}}>
                    <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                        <DialogContentText id="alert-dialog-description">
                            <h1>Cheque Upload</h1>
                        </DialogContentText>
                        <UploadButton/>
                        
                    </div>
                    <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                        <DialogContentText id="alert-dialog-description">
                            <h1>Statement Upload</h1>
                        </DialogContentText>
                        <UploadButton/>
                    </div>
                </div>
            </DialogContent>
            <DialogContent dividers={scroll === 'paper'}>
                <DialogContentText id="alert-dialog-description">
                    <h1 className="text-dark">Selected invoices</h1>
                </DialogContentText>
                <DialogContent style={{width: '100%'}} ref={descriptionElementRef} tabIndex={-1}>
                    <SimpleMuiDataGrid dataArray={dataArray} />
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

                    }}
                />
            </DialogContent>
        </Dialog>
    </>
    );
};

export default InvoicePopUp;
