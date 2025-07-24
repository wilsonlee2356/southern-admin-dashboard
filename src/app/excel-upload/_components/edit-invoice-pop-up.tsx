"use client";
import CustomPopUp from "@/components/Layouts/Dialog/PopUp";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import InputGroup from "@/components/FormElements/InputGroup";
import { InvoiceData } from "@/types/ObjectTypes/InvoiceType";

// TypeScript Interfaces


interface EditInvoicePopUpPropsType {
  title: string;
  open: boolean;
  onClose: (open: boolean) => void;
  invoiceEditing: InvoiceData | null;
}

interface FormData {
  invoiceNum: string;
  postcode: string;
  amount: number;
  clientName: string;
  fullName: string;
  buildingAddress: string;
  streetAddress: string;
  address: string;
  invoiceDate: any;
}

function EditInvoicePopUp({
    title,
    open,
    onClose,
    invoiceEditing,
}: EditInvoicePopUpPropsType) {
    const [formData, setFormData] = useState<FormData>({
        invoiceNum: "",
        postcode: "",
        amount: 0,
        clientName: "",
        fullName: "",
        buildingAddress: "",
        streetAddress: "",
        address: "",
        invoiceDate: dayjs(new Date()),
    });

  // Close dialog
  const closePopUp = () => {
    onClose(false);
  };

  return (
    <>
        <CustomPopUp
            title={title}
            open={open}
            onClose={onClose}>
            <div
                style={{ height: "700px", width: "100%" }}
                className="justify-left flex flex-row content-stretch items-start gap-50">
                    <div className="flex h-full flex-row gap-4.5">

                    </div>
            </div>
        </CustomPopUp>
    </>
  );
}

export default EditInvoicePopUp;
