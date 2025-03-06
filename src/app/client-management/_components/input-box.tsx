import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import InputGroup from "@/components/FormElements/InputGroup";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import { Button } from "@/components/ui-elements/button";
import { CloseIcon, MessageOutlineIcon, UploadIcon } from "@/assets/icons";

export function InputBox() {
  return (
    <ShowcaseSection title="Invoice Input Form" className="!p-6.5">
      <form action="#">
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
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
          />
        </div>
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <div className="w-full xl:w-4/12">
            <DatePickerOne label="Invoice Date" />
          </div>
          <InputGroup
            label="Client"
            type="text"
            placeholder="Enter client"
            className="w-full xl:w-4/12" // 40% width on extra-large screens
          />
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
