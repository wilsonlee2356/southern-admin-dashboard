"use client";
import React, { JSX } from "react";
import { useEffect } from "react";
import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
} from "@heroui/autocomplete";

const test = [
  {
    key: 1,
    label: "Test1",
  },
  {
    key: 2,
    label: "Test2",
  },
  {
    key: 3,
    label: "Test3",
  },
];

const AutoCompleteOne = ({labels}:{labels:string[]}) => {

  return (
    <div className="w-full">
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        {labels[0]}
      </label>
      <div className="relative">
        <Autocomplete
          allowsCustomValue
          className="w-full rounded-[7px] bg-transparent font-normal outline-none transition dark:border-dark-3 dark:bg-dark-2"
          inputProps={{
            classNames: {
              input:
                "w-full focus:border-none focus:outline-none border-transparent focus:border-transparent focus:ring-0",
              inputWrapper: "h-[50px] focus:border-none",
            },
          }}
          listboxProps={{
            hideSelectedIcon: true,
            itemClasses: {
              base: [
                "rounded-medium",
                "text-default-500",
                "transition-opacity",
                "data-[hover=true]:text-foreground",
                "dark:data-[hover=true]:bg-black-50",
                "data-[pressed=true]:opacity-70",
                "data-[hover=true]:bg-black-200",
                "data-[selectable=true]:focus:bg-black-100",
                "data-[focus-visible=true]:ring-none",
              ],
            },
          }}
          popoverProps={{
            offset: 1,
            classNames: {
              base: "border-none",
              content: "bg-white",
            },
          }}
          defaultItems={test}
          placeholder={labels[1]}
        >
          {(item) => (
            <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
          )}
        </Autocomplete>
      </div>
    </div>
  );
};

export default AutoCompleteOne;
