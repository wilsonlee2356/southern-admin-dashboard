"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui-elements/button";
import { CheckIcon } from "@/assets/icons";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PdfViewPopUp from "./PdfViewPopUp";
import InputGroup from "@/components/FormElements/InputGroup";
import ChequeEditMuiDataGrid from "@/components/Tables/DataGrid/ChequeEditMuiDataGrid";
import { TextAreaOne } from "@/components/FormElements/InputGroup/TextAreaOne";
import { InvoiceCheques, InvoiceData, post } from "@/types/ObjectTypes/InvoiceType";
import { CombinedService } from "@/app/api/invoice";
import MuiDatePicker from "@/components/FormElements/DatePicker/MuiDatePicker";
import AutoCompleteWithSelectorButton from "@/components/FormElements/AutoCompletes/AutoCompleteWithSelectorButton";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useAuthenticatedRequest } from "@/lib/auth";
import { usePostClientContent } from "@/utils/post-client-content";
import { useAlert } from "@/utils/AlertProvider";

// TypeScript Interfaces


interface CustomPopUpPropsType {
  title: string;
  open: boolean;
  onClose: (open: boolean) => void;
  children: React.ReactNode;
}

function CustomPopUp({
    title,
    open,
    onClose,
    children,
}: CustomPopUpPropsType) {

  // Close dialog
  const closePopUp = () => {
    onClose(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={closePopUp}
        fullWidth={true}
        maxWidth={"xl"}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          {title}
          <IconButton
            onClick={() => {
              closePopUp();
            }}
            style={{ float: "right" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
            {children}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CustomPopUp;
