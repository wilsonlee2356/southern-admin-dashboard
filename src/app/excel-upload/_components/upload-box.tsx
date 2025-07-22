// SearchBox.tsx
"use client";

import React, { useState } from "react";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";
import { Input } from "@heroui/input";
import { UploadIcon } from "@/assets/icons";
import { CombinedService } from "@/app/api/invoice";
import { useAuthenticatedRequestFileUpload } from "@/lib/auth";
import { usePostClientContent } from "@/utils/post-client-content";
import { useSession } from "next-auth/react";
import { Invoice, InvoiceData, invoicePostList, post } from "@/types/ObjectTypes/InvoiceType";


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
    const { makeAuthenticatedRequest } = useAuthenticatedRequestFileUpload();
    const { updateData } = usePostClientContent();

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


  return (
    <ShowcaseSection title="Excel Upload Form" className="!p-6.5">
        

        <div className="flex flex-col gap-4 xl:flex-row xl:justify-center">

            <Input type="file" 
                accept=".xlsx,.xls"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    if (event.target.files && event.target.files.length > 0) {
                        setFileUpload(event.target.files[0]);
                        console.log(fileUpload);
                    }
                }}
            />

            {(status === "authenticated" && session?.accessToken && (session.role === 'admins' || session.role === 'editors')) 
            ? <Button
                label="Create"
                variant="primary"
                shape="full"
                size="default"
                icon={<UploadIcon />}
                onClick={() => {
                    handleUpload();
                }}/> 
            : <></>}
        </div>


        <div className="p-4">

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {postRead && postRead.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-2">April 2025 Posts</h2>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Postcode</th>
                <th className="border border-gray-300 p-2">Building Address</th>
                <th className="border border-gray-300 p-2">Client Name</th>
                <th className="border border-gray-300 p-2">Client Full Name</th>
              </tr>
            </thead>
            <tbody>
              {postRead.map((post, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{post.postcode}</td>
                  <td className="border border-gray-300 p-2">{post.buildingAddress}</td>
                  <td className="border border-gray-300 p-2">{post.client.clientName}</td>
                  <td className="border border-gray-300 p-2">{post.client.fullName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {invoiceRead && invoiceRead.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-2">Invoices</h2>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Invoice Number</th>
                <th className="border border-gray-300 p-2">Postcode</th>
                <th className="border border-gray-300 p-2">Client Name</th>
                <th className="border border-gray-300 p-2">Amount</th>
                <th className="border border-gray-300 p-2">Invoice Date</th>
                <th className="border border-gray-300 p-2">Settlement Date</th>
              </tr>
            </thead>
            <tbody>
              {invoiceRead.map((invoice, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{invoice.invoiceNum}</td>
                  <td className="border border-gray-300 p-2">{invoice.post.postcode}</td>
                  <td className="border border-gray-300 p-2">{invoice.post.client.clientName}</td>
                  <td className="border border-gray-300 p-2">{invoice.amount}</td>
                  <td className="border border-gray-300 p-2">{invoice.invoiceDate}</td>
                  <td className="border border-gray-300 p-2">{invoice.settlementDate || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
        </div>


    </ShowcaseSection>
  );
};
export default UploadBox;
