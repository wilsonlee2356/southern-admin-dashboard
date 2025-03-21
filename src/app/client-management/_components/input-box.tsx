import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import InputGroup from "@/components/FormElements/InputGroup";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import { Button } from "@/components/ui-elements/button";
import { CloseIcon, MessageOutlineIcon, UploadIcon } from "@/assets/icons";
import AutoCompleteOne from "@/components/FormElements/AutoCompletes/AutoCompleteOne";
import { invoice, invoiceArray } from "@/types/ObjectTypes/InvoiceType";

// const test = [
//   {
//     key: 1,
//     name: "Test1",
//   },
//   {
//     key: 2,
//     name: "Test2",
//   },
//   {
//     key: 3,
//     name: "Test3",
//   },
// ];


export function InputBox({ dataArray } : invoiceArray) {
  
  const invoiceNumArr = dataArray.map((item) => ({key: item.id}));
  const clientNameArr = dataArray.map((item) => ({key: item.id, name: item.name}));
  const postcodeArr = dataArray.map((item) => ({key: item.id, name: item.postcode}));

  return (
    <ShowcaseSection title="Invoice Input Form" className="!p-6.5">
      <form action="#">
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <AutoCompleteOne title="Invoice Number" placeholder="Enter Invoice Number" dataArr={invoiceNumArr}/>
          <AutoCompleteOne title="Client Name" placeholder="Enter Client Name" dataArr={clientNameArr}/>
        </div>
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <AutoCompleteOne title="Postcode" placeholder="Enter Postcode" dataArr={postcodeArr}/>
          <AutoCompleteOne title="Amount" placeholder="Enter Amount" dataArr={[]}/>
        </div>
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <div className="w-full xl:w-4/12">
            <DatePickerOne label="Invoice Date" />
          </div>
          <div className="w-full xl:w-4/12">
            <DatePickerOne label="Settlement Date" />
          </div>
        </div>
        
        <div className="flex flex-col gap-4 xl:flex-row xl:justify-center">
          <Button
            label="Clear"
            variant="outlinePrimary"
            shape="full"
            size="default"
            icon={<CloseIcon />}
          />

          <Button
            label="Upload"
            variant="primary"
            shape="full"
            size="default"
            icon={<UploadIcon />}
          />
        </div>
      </form>
    </ShowcaseSection>
  );
}
