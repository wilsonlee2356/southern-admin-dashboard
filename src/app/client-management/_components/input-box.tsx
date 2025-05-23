import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Button } from "@/components/ui-elements/button";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CloseIcon, MessageOutlineIcon, UploadIcon } from "@/assets/icons";
import MuiDatePicker from "@/components/FormElements/DatePicker/MuiDatePicker";
import AutoCompleteOne from "@/components/FormElements/AutoCompletes/AutoCompleteWithSelectorButton";
import { client, post, invoiceData, invoiceDataOutput } from "@/types/ObjectTypes/InvoiceType";
import { CombinedService } from "@/app/api/invoice";
import { useEffect, useState } from "react";

type InputBoxProps = {
  dataArray: invoiceData[]; // Pass data as a prop instead of fetching here
  clientData: client[];
  postData: post[];
  setDataToShow: any;
};



export function InputBox({ dataArray, clientData, postData, setDataToShow } : InputBoxProps) {

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [amount, setAmount] = useState("");
  const [invoiceDate, setInvoiceDate] = useState<Dayjs | null>(dayjs());

  // useEffect(() => {
  //       console.log({ amount });
  // }, [amount]);

  const invoiceNumArr = dataArray.map((item) => ({ 
    key: item.invoiceId.toString(),
    name: item.invoiceNum.toString(), }));
  const clientNameArr = clientData.map((item) => ({
    key: item.clientId.toString(),
    name: item.clientName,
  }));
  const postcodeArr = postData.map((item) => ({
    key: item.postId.toString(),
    name: item.postcode,
  }));

  // const invoiceNumArr = dataArray.map((item) => ({ 
  //   key: item.invoiceId.toString(),
  //   name: item.invoiceNum.toString(), }));
  // const clientNameArr = dataArray.map((item) => ({
  //   key: item.invoiceId.toString(),
  //   name: item.client.clientName,
  // }));
  // const postcodeArr = dataArray.map((item) => ({
  //   key: item.invoiceId.toString(),
  //   name: item.post.postcode,
  // }));

  const handleClear = () => {
    setInvoiceNumber("");
    setClientName("");
    setPostcode("");
    setAmount("");
    setInvoiceDate(null);
  };

  const handleAdd = () => {
      const updateInvoice : invoiceDataOutput = {
        invoiceNum: invoiceNumber,
        post: {
          postcode: postcode,
          address: "",
          client: {
            clientName: clientName,
            fullName: null,
          },
        },
        
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
          setDataToShow((prevData: invoiceData[]) => [...prevData, response]);
        }
        
      }).catch((error) => {
        console.error("Error creating invoice:", error);
      });
  }

  // const getNewlyInsertedInvoice = async ( invoiceId : number ) => {
  //   try {
  //     const response = await CombinedService.get_invoice_by_id(invoiceId.toString());
  //     setDataToShow((prevData: invoiceData[]) => [...prevData, response]);
  //   } catch (error) {
  //     console.error('Error fetching all invoices:', error);
  //   }
  // }


  return (
    <ShowcaseSection title="Invoice Input Form" className="!p-6.5">
      <form action="#">
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <AutoCompleteOne title="Invoice Number" placeholder="Enter Invoice Number" dataArr={invoiceNumArr} input={invoiceNumber} stateSetter={setInvoiceNumber}/>
          <AutoCompleteOne title="Client Name" placeholder="Enter Client Name" dataArr={clientNameArr} input={clientName} stateSetter={setClientName}/>
        </div>
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <AutoCompleteOne title="Postcode" placeholder="Enter Postcode" dataArr={postcodeArr} input={postcode} stateSetter={setPostcode}/>
          <AutoCompleteOne title="Amount" placeholder="Enter Amount" dataArr={[]} input={amount} stateSetter={setAmount}/>
        </div>
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
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
          {/* <div className="w-full xl:w-4/12">
            <DatePickerThree label="Settlement Date"/>
          </div> */}
        </div>
        
        <div className="flex flex-col gap-4 xl:flex-row xl:justify-center">
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
            //type="submit"
            label="Enter"
            variant="primary"
            shape="full"
            size="default"
            onClick={() => {
              handleAdd();
            }}
            icon={<UploadIcon />}
          />
        </div>
      </form>
    </ShowcaseSection>
  );
}
