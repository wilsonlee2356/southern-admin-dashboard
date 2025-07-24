// SearchBox.tsx
"use client";

import React, { useState } from "react";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";
import { Input } from "@heroui/input";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { UploadIcon } from "@/assets/icons";
import { CombinedService } from "@/app/api/invoice";
import { useAuthenticatedRequestFileUpload } from "@/lib/auth";
import { usePostClientContent } from "@/utils/post-client-content";
import { useSession } from "next-auth/react";
import { Invoice, InvoiceData, invoicePostList, post } from "@/types/ObjectTypes/InvoiceType";
import MuiDataGrid from "@/components/Tables/DataGrid/MuiDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import { EditIcon } from "@/components/Tables/icons";
import EditInvoicePopUp from "./edit-invoice-pop-up";


// interface SheetData {
//   [sheetName: string]: string[][];
// }

type UploadBoxProps = {

};

const UploadBox = ({}: UploadBoxProps) => {

    const [fileUpload, setFileUpload] = useState<File | null>();
    // const [excelData, setExcelData] = useState<SheetData | null>(null);
    const [invoiceRead, setInvoiceRead] = useState<InvoiceData[]>([]);
    const [postRead, setPostRead] = useState<post[]>([]);
    const { data: session, status } = useSession();
    const [error, setError] = useState<string>("");
    const [invoicePopUpOpen, setInvoicePopUpOpen] = useState<boolean>(false);
    const [editingInvoice, setEditingInvoice] = useState<InvoiceData | null>(null);
    
    const { makeAuthenticatedRequest } = useAuthenticatedRequestFileUpload();

  // React.useEffect(() => {
  //   console.log("client array:", clientNameArr);
  //   console.log("post array:", postcodeArr);
  // }, []);

  const handleUpload = async () => {
    if (!fileUpload) {
      setError('Please select a file');
      return;
    }

    try {
      CombinedService.upload_excel(fileUpload, makeAuthenticatedRequest).then((invoicePostDataRead : invoicePostList)=>{
        // setExcelData(response);'
        console.log("Excel data: ", invoicePostDataRead);
        setInvoiceRead(invoicePostDataRead.invoiceList);
        setPostRead(invoicePostDataRead.postList);
        setError("");
      });
    } catch (err) {
      setError('Error uploading file');
      console.error(err);
    }
  };

  const findInvoiceById = (invoiceId : number) : InvoiceData | null => {
    invoiceRead.map((invoice)=>{
        if(invoice.invoiceId === invoiceId)
            return invoice;
    });
    return null;
  }

  const findPostById = (postId : number) : post | null => {
    postRead.map((post)=>{
        if(post.postId === postId)
            return post;
    });
    return null;
  }

  const invoiceColumns: GridColDef[] = [
      {
        field: "id",
        headerName: "id",
        valueGetter: (value, row) => row.invoiceId,
      },
      {
        field: "invoice number",
        headerName: "Invoice No.",
        flex: 2,
        align: "center",
        headerAlign: "center",
        valueGetter: (value, row) => row.invoiceNum,
        renderCell: (params) => (
          <h5 className="text-dark dark:text-white">{params.value}</h5>
        ),
      },
      {
        field: "clientName",
        headerName: "Client Name",
        flex: 2,
        align: "center",
        headerAlign: "center",
        valueGetter: (value, row) => row.post.client.clientName,
        renderCell: (params) => (
          <h5 className="text-dark dark:text-white">{params.value}</h5>
        ),
      },
      {
        field: "postcode",
        headerName: "Postcode",
        flex: 4,
        align: "center",
        headerAlign: "center",
        valueGetter: (value, row) => row.post.postcode,
        renderCell: (params) => (
          <h5 className="text-dark dark:text-white">{params.value}</h5>
        ),
      },
      {
        field: "totalAmount",
        headerName: "Invoice Amount ($HKD)",
        flex: 2,
        align: "center",
        headerAlign: "center",
        valueGetter: (value, row) =>
          row.totalAmount === null ? 0 : row.amount,
        renderCell: (params) => (
          <h5 className="text-dark dark:text-white">{params.value}</h5>
        ),
      },
      {
        field: "settlement date",
        headerName: "Settlement date",
        flex: 2,
        align: "center",
        headerAlign: "center",
        valueGetter: (value, row) => (row.settlementDate) ? row.settlementDate : "N/A",
        renderCell: (params) => (
          <h5 className="text-dark dark:text-white">{params.value}</h5>
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
            <div className="flex items-center justify-center gap-x-3.5">
            
            {(status === "authenticated" && session?.accessToken && (session.role === 'admins' || session.role === 'editors')) ?
            <>
            <button
                className="text-dark dark:text-white"
                onClick={() => {
                    setInvoicePopUpOpen(true);
                    const invoiceOfThisRow = findInvoiceById(Number(params.id));
                    if(invoiceOfThisRow !== null){
                        setEditingInvoice(invoiceOfThisRow);
                    }
                }}
            >
                <span className="sr-only">Edit Invoice</span>
                <EditIcon className="fill-dark dark:fill-white" />
            </button>
            </> : <></>}
            </div>
        ),
        },
    ];

    const postColumns: GridColDef[] = [
      {
        field: "id",
        headerName: "id",
        valueGetter: (value, row) => row.postId,
      },
      {
        field: "postcode",
        headerName: "Postcode",
        flex: 1.2,
        align: "center",
        headerAlign: "center",
        valueGetter: (value, row) => row.postcode,
        renderCell: (params) => (
          <h5 className="text-dark dark:text-white">{params.value}</h5>
        ),
      },
      {
        field: "building address",
        headerName: "Building Address",
        flex: 2,
        align: "center",
        headerAlign: "center",
        valueGetter: (value, row) => row.buildingAddress,
        renderCell: (params) => (
          <h5 className="text-dark dark:text-white">{params.value}</h5>
        ),
      },
      {
        field: "clientName",
        headerName: "Client Name",
        flex: 2,
        align: "center",
        headerAlign: "center",
        valueGetter: (value, row) => row.client.clientName,
        renderCell: (params) => (
          <h5 className="text-dark dark:text-white">{params.value}</h5>
        ),
      },
      {
        field: "client full name",
        headerName: "Client Fullname",
        flex: 3,
        align: "center",
        headerAlign: "center",
        valueGetter: (value, row) => (row.client.fullName === "" || !row.client.fullName) ? "N/A" : row.client.fullName,
        renderCell: (params) => (
          <h5 className="text-dark dark:text-white">{params.value}</h5>
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
            <div className="flex items-center justify-center gap-x-3.5">
            
            {(status === "authenticated" && session?.accessToken && (session.role === 'admins' || session.role === 'editors')) ?
            <>
            <button
                className="text-dark dark:text-white"
                onClick={() => {

                }}
            >
                <span className="sr-only">Edit Invoice</span>
                <EditIcon className="fill-dark dark:fill-white" />
            </button>
            </> : <></>}
            </div>
        ),
        },
    ];

  return (
    <ShowcaseSection title="Excel Upload Form" className="!p-6.5">

        <div className="flex flex-col gap-4 xl:flex-row xl:justify-center xl:item-center">
            {(status === "authenticated" && session?.accessToken && (session.role === 'admins' || session.role === 'editors')) 
            ? 
            <>
            <Input type="file" 
                accept=".xlsx,.xls"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    if (event.target.files && event.target.files.length > 0) {
                        setFileUpload(event.target.files[0]);
                        console.log(fileUpload);
                    }
                }}
            />
            <Button
                label="Upload"
                variant="primary"
                shape="full"
                size="default"
                icon={<UploadIcon />}
                onClick={() => {
                    handleUpload();
                }}/> 
            </>
            : <></>}
        </div>

        <div className="p-4">

            {error && <p className="text-red-500 mb-4">{error}</p>}
            
            <div className="flex w-full flex-col">
                <Tabs
                    aria-label="Options"
                    className="items-center justify-center"
                    classNames={{
                        base: "", // Base styles for the entire Tabs component
                        tabList: "flex gap-4 p-2 bg-gray-100 rounded-lg", // Styling for the tab list container
                        tab: "px-4 py-2 rounded-lg transition-colors duration-200 data-[selected=true]:bg-blue-500 data-[selected=true]:text-white data-[selected=true]:font-bold", // Target data-selected directly
                    }}
                    >
                    <Tab key="invoice" title="Invoices">
                        <Card>
                            <CardBody>
                                <MuiDataGrid 
                                    columns={invoiceColumns} 
                                    rowdata={invoiceRead} 
                                    identifyRowId={(row: InvoiceData) => row.invoiceId} 
                                    columnVisible={{id: false,}}                  
                                />
                            </CardBody>
                        </Card>
                    </Tab>
                    <Tab key="post" title="Posts">
                        <Card>
                            <CardBody>
                                <MuiDataGrid 
                                    columns={postColumns} 
                                    rowdata={postRead} 
                                    identifyRowId={(row: post) => row.postId} 
                                    columnVisible={{id: false,}}                  
                                />
                            </CardBody>
                        </Card>
                    </Tab>
                </Tabs>

                <Button
                className="w-1/12"
                label="Upload"
                variant="primary"
                shape="full"
                size="default"
                icon={<UploadIcon />}
                onClick={() => {
                    handleUpload();
                }}/> 
            </div>
        </div>

        <EditInvoicePopUp
            title="Edit Invoice Data"
            open={invoicePopUpOpen}
            onClose={setInvoicePopUpOpen}
            invoiceEditing={editingInvoice}
        />

    </ShowcaseSection>

    
  );
};
export default UploadBox;
