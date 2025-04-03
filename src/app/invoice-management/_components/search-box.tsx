// SearchBox.tsx
"use client";

import { useState } from "react";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";
import AutoCompleteOne from "@/components/FormElements/AutoCompletes/AutoCompleteOne";
import DropdownList from "@/components/FormElements/Dropdown/DropdownList";
import { invoice } from "@/types/ObjectTypes/InvoiceType";
import { CloseIcon, SearchIcon } from "@/assets/icons";

type SearchBoxProps = {
  dataArray: invoice[]; // Pass data as a prop instead of fetching here
};

export function SearchBox({ dataArray }: SearchBoxProps) {
  // Manage state locally
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState("");

  const invoiceNumArr = dataArray.map((item) => ({ key: item.id }));
  const clientNameArr = dataArray.map((item) => ({
    key: item.id,
    name: item.name,
  }));
  const postcodeArr = dataArray.map((item) => ({
    key: item.id,
    name: item.postcode,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ invoiceNumber, clientName, postcode, amount, period });
    // Add your search logic here
  };

  return (
    <ShowcaseSection title="Invoice Search Form" className="!p-6.5">
      <form onSubmit={handleSubmit}>
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <AutoCompleteOne
            title="Invoice Number"
            placeholder="Enter Invoice Number"
            dataArr={invoiceNumArr}
            stateSetter={setInvoiceNumber}
          />
          <AutoCompleteOne
            title="Client Name"
            placeholder="Enter Client Name"
            dataArr={clientNameArr}
            stateSetter={setClientName}
          />
        </div>
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <AutoCompleteOne
            title="Postcode"
            placeholder="Enter Postcode"
            dataArr={postcodeArr}
            stateSetter={setPostcode}
          />
          <AutoCompleteOne
            title="Amount"
            placeholder="Enter Amount"
            dataArr={[]}
            stateSetter={setAmount}
          />
        </div>
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <DropdownList
            title="Period"
            placeholder="Select Period"
            isListOfTime={true}
            stateSetter={setPeriod}
          />
        </div>
        <div className="flex flex-col gap-4 xl:flex-row xl:justify-center">
          <Button
            label="Clear"
            variant="outlinePrimary"
            shape="full"
            size="default"
            icon={<CloseIcon />}
            onClick={() => {
              setInvoiceNumber("");
              setClientName("");
              setPostcode("");
              setAmount("");
              setPeriod("");
            }}
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
