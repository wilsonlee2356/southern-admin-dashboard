import { CloseIcon, MessageOutlineIcon, SearchIcon } from "@/assets/icons";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { Select } from "@/components/FormElements/select";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";

export function SearchBox() {
  return (
    <ShowcaseSection title="Invoice Search Form" className="!p-6.5">
      <form action="#">
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="Invoice No. "
            type="text"
            placeholder="Enter invoice number"
            className="w-full xl:w-5/12" // 40% width on extra-large screens
          />

          <InputGroup
            label="Client"
            type="text"
            placeholder="Enter client"
            className="w-full xl:w-4/12" // 20% width on extra-large screens
          />

          <InputGroup
            label="Amount"
            type="number"
            placeholder="Enter amount"
            className="w-full xl:w-3/12" // 40% width on extra-large screens
          />
        </div>
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <div className="w-full xl:w-6/12">
            <DatePickerOne label="Invoice Date" />
          </div>
          <div className="w-full xl:w-6/12">
            <DatePickerOne label="Settlement Date" />
          </div>
        </div>
        {/* 
        <InputGroup
          label="Email"
          type="email"
          placeholder="Enter your email address"
          className="mb-4.5"
          required
        /> */}

        {/* <InputGroup
          label="Subject"
          type="text"
          placeholder="Enter your subject"
          className="mb-4.5"
        />

        <Select
          label="Subject"
          placeholder="Select your subject"
          className="mb-4.5"
          items={[
            { label: "United States", value: "USA" },
            { label: "United Kingdom", value: "UK" },
            { label: "Canada", value: "Canada" },
          ]}
        /> */}

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
            icon={<SearchIcon />}
          />
        </div>
      </form>
    </ShowcaseSection>
  );
}
