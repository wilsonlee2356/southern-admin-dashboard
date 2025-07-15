"use client";
import React from "react";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// import { Viewer, Worker } from '@react-pdf-viewer/core';
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// import "@react-pdf-viewer/core/lib/styles/index.css";
// import "@react-pdf-viewer/default-layout/lib/styles/index.css";
// import { Image } from "@heroui/image";

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
    pdf: string;
    open: boolean;
    setOpen: any;
}



function PdfViewPopUp ({ pdf, open, setOpen}: ImageViewPopUpPropsType){

    // const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const [pdfUrl, setPdfUrl] = React.useState<string>("");

    useEffect(() => {
        if(pdf !== null && pdf !== "" && pdf !== undefined) {
            // const url = URL.createObjectURL(base64toBlob(pdf));
            setPdfUrl(pdf);

            // return () => URL.revokeObjectURL(url);
        }
    }, [pdf]);

    // const pdfContentType = 'application/pdf';

    // const base64toBlob = (data: string) => {
    //     // Cut the prefix `data:application/pdf;base64` from the raw base 64
    //     const base64WithoutPrefix = data.slice(`data:${pdfContentType};base64,`.length);

    //     const bytes = atob(base64WithoutPrefix);
    //     let length = bytes.length;
    //     let out = new Uint8Array(length);

    //     while (length--) {
    //         out[length] = bytes.charCodeAt(length);
    //     }

    //     return new Blob([out], { type: pdfContentType });
    // };

    
    //console.log("Pop up opened: ", invoiceNum);
    const closePopUp = ()=> {
        setPdfUrl("");
        setOpen(false);
    }

    
    return (
    <>
        <Dialog 
            open={open} onClose={setOpen} fullWidth 
            maxWidth={"xl"} aria-labelledby="alert-dialog-title" 
            aria-describedby="alert-dialog-description">
            <DialogTitle> Image Preview <IconButton onClick={closePopUp} style={{float:'right'}}><CloseIcon ></CloseIcon></IconButton> </DialogTitle>
            <DialogContent>
                <div className="flex justify-center items-center h-1.9/2 w-1.9/2">
                    <iframe
                        allow="fullscreen"
                        src={pdf}
                        width="95%"
                        height="700px" // Adjust height as needed
                        title="Embedded PDF"
                        // Optional: Disable toolbar or other features
                        // src={`${pdfDataUrl}#toolbar=0&navpanes=0`} 
                        />
                    {/* <Worker workerUrl="/pdf.worker.min.mjs">
                        <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance, ]}/>
                    </Worker> */}
                {/* <Image 
                    src={pdf}
                    alt="Image Image"
                    width="80%"
                    height="50%"
                    style={{ opacity: 1}}
                    /> */}
                </div>
            </DialogContent>
        </Dialog>
    </>
    );
};

export default PdfViewPopUp;
