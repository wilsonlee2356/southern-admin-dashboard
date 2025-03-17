import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import InputGroup from "@/components/FormElements/InputGroup";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import { Button } from "@/components/ui-elements/button";
import { CloseIcon, MessageOutlineIcon, UploadIcon } from "@/assets/icons";
import AutoCompleteOne from "@/components/FormElements/AutoCompletes/AutoCompleteOne";

const test = [
  {
    key: 1,
    name: "Test1",
  },
  {
    key: 2,
    name: "Test2",
  },
  {
    key: 3,
    name: "Test3",
  },
];


export function InputBox() {
  return (
    <ShowcaseSection title="Invoice Input Form" className="!p-6.5">
      <form action="#">
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <AutoCompleteOne title="Invoice Number" placeholder="Enter Invoice Number" dataArr={test}/>
          <AutoCompleteOne title="Client Name" placeholder="Enter Client Name" dataArr={test}/>
          
          {/* <InputGroup
            label="Invoice No. "
            type="text"
            placeholder="Enter invoice number"
            className="w-full xl:w-5/12" // 40% width on extra-large screens
          />

          <InputGroup
            label="Order"
            type="number"
            placeholder="Enter order"
            className="w-full xl:w-2/12" // 20% width on extra-large screens
          />

          <InputGroup
            label="Amount"
            type="number"
            placeholder="Enter amount"
            className="w-full xl:w-5/12" // 40% width on extra-large screens
          /> */}
        </div>
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <AutoCompleteOne title="Postcode" placeholder="Enter Postcode" dataArr={test}/>
          <AutoCompleteOne title="Amount" placeholder="Enter Amount" dataArr={test}/>
        </div>
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <div className="w-full xl:w-4/12">
            <DatePickerOne label="Invoice Date" />
          </div>
          {/* <InputGroup
            label="Client"
            type="text"
            placeholder="Enter client"
            className="w-full xl:w-4/12" // 40% width on extra-large screens
          /> */}
          <div className="w-full xl:w-4/12">
            <DatePickerOne label="Settlement Date" />
          </div>
        </div>
        

        {/* <TextAreaGroup label="Message" placeholder="Type your message" /> */}
        <div className="flex flex-col gap-4 xl:flex-row xl:justify-center">
          <Button
            label="Clear"
            variant="outlinePrimary"
            shape="full"
            size="default"
            icon={<CloseIcon />}
          />

          <Button
            label="Search"
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
