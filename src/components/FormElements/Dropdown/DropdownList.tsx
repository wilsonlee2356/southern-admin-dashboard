"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

type ArrayType = {
    key: string;
    name?: string;
}
  
type PropsType = {
    title: string;
    placeholder: string
    isListOfTime: boolean
    stateSetter: any;
    input?: string;
}

let timeList: ArrayType[] = [
    { key: "1", name: "Within a month" },
    { key: "2", name: "Within 2 month" },
    { key: "3", name: "Within 3 month" },
  ];
  

 const DropdownList = ({ title, placeholder, isListOfTime, stateSetter, input} : PropsType) => {
  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    input = event.target.value as string;
    stateSetter(event.target.value as string);
  };

  return (
    <div className="w-full">
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        {title}
      </label>
      <div className="">
      <FormControl fullWidth>
        <Select
          displayEmpty
          value={input}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>{placeholder}</em>;
            }
            return selected;
          }}
          onChange={handleChange}
          className="text-dark dark:text-white relative rounded-[7px] bg-gray font-normal outline-none transition dark:border-dark-3 dark:bg-dark-2"
        >
          {(timeList).map((item, index) => (
            <MenuItem key={index} value={item.key}>{item.name}</MenuItem>
          ))}
          
        </Select>
      </FormControl>
      </div>
      </div>
  );
}
export default DropdownList;