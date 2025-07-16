"use client";
import React, { JSX, SetStateAction } from "react";
import { useEffect } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

type DatePickerProps = {
    title : string;
    value: dayjs.Dayjs | null | undefined;
    onChange: (value: SetStateAction<dayjs.Dayjs | null>) => void;
    error?: string;
    [key: string]: any; // Allow other props to be passed
};

function MuiDatePicker({title, value, onChange, error = "", ...params}: DatePickerProps) {
    const currentYear = dayjs(); // Get the current year using dayjs


    return (
    <div className="w-full">
        <label aria-label="Date picker" className="mb-3 block text-body-md font-medium text-dark dark:text-white">
        {title}
        </label>
        <div className="relative">
        <DatePicker
                aria-label="Date Picker"
                className="w-full rounded-[7px] border-none bg-gray font-normal outline-none transition dark:border-dark-3 dark:bg-dark-2"
                // InputProps={{
                //     disableUnderline: true
                // }}
                
                sx={{ 
                    width: '100%',
                }}
                maxDate={currentYear}
                openTo="year"
                views={['year', 'month', 'day']}
                yearsOrder="desc"
                value={value}
                onChange={onChange}
                
        />
        </div>
        <label className="text-red-500 text-xs mt-1">
          {error}
       </label>
    </div>
    );
}

export default MuiDatePicker;