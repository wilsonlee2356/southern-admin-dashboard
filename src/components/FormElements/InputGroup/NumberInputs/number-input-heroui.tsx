import { cn } from "@/lib/utils";
import { type HTMLInputTypeAttribute, useId } from "react";
import { NumberInput } from "@heroui/react";

type NumberInputHeroUIProps = {
    className: string;
    label: string;
    placeholder: string;
    required?: boolean;
    value?: number;
    onChange?: any;
};

const NumberInputHeroUI = ({
  className,
  label,
  placeholder,
  required = false,
  value,
  onChange,
  ...props
} : NumberInputHeroUIProps) => {
  const id = useId();

  return (
    <div className={className}>
      <label
        aria-label="Number Input Title"
        htmlFor={id}
        className="mb-3 block text-body-sm font-medium text-dark dark:text-white"
      >
        {label}
        {/* {required && <span className="ml-1 select-none text-red">*</span>} */}
      </label>

      <div className="relative">
        <NumberInput 
          aria-label="Number Input"
          classNames={{
              base: "w-full rounded-[7px] bg-gray",
              innerWrapper: "h-[35px] focus:border-none",
              input: ["bg-transparent",
                  "border-none",
                  "focus:outline-none",
                  "focus:border-none",
                  "focus:ring-0",
              ],
          }}
          id={id} 
          placeholder={placeholder} 
          value={value} 
          onValueChange={onChange}
          hideStepper
          fullWidth/>
       </div>
      {/* <div
        className={cn(
          "relative mt-3 [&_svg]:absolute [&_svg]:top-1/2 [&_svg]:-translate-y-1/2",
          props.iconPosition === "left"
            ? "[&_svg]:left-4.5"
            : "[&_svg]:right-4.5",
        )}
      >
        <input
          id={id}
          type={type}
          name={props.name}
          placeholder={placeholder}
          onChange={handleChange}
          value={props.value}
          defaultValue={props.defaultValue}
          className={cn(
            "w-full rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-2 data-[active=true]:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary dark:disabled:bg-dark dark:data-[active=true]:border-primary",
            type === "file"
              ? getFileStyles(props.fileStyleVariant!)
              : "px-5.5 py-3 text-dark placeholder:text-dark-6 dark:text-white",
            props.iconPosition === "left" && "pl-12.5",
            props.height === "sm" && "py-2.5",
          )}
          required={required}
          disabled={disabled}
          data-active={active}
        />

        {icon}
      </div> */}
    </div>
  );
};

export default NumberInputHeroUI;


