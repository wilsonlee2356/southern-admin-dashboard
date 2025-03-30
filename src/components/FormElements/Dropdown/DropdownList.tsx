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
}

let timeList: ArrayType[] = [
    { key: "1", name: "Within a month" },
    { key: "2", name: "Within 2 month" },
    { key: "3", name: "Within 3 month" },
  ];
  

 const DropdownList = ({ title, placeholder, isListOfTime, stateSetter } : PropsType) => {
  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  return (
    <div className="w-full">
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        {title}
      </label>
      <div className="relative">
      <FormControl fullWidth>
        <Select
          displayEmpty
          value={age}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>{placeholder}</em>;
            }

            return selected;
          }}
          onChange={handleChange}
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