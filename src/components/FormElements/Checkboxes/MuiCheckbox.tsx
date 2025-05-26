import { CheckIcon, XIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { useId } from "react";
import Checkbox from '@mui/material/Checkbox';


type PropsType = {
  withBg?: boolean;
  label: string;
  name?: string;
  minimal?: boolean;
  checked: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  radius?: "default" | "md";
};

export function MuiCheckbox({
  label,
  name,
  withBg,
  minimal,
  checked,
  onChange,
  radius,
}: PropsType) {
  const id = useId();

  return (
    <div>
      <label
        htmlFor={id}
        className={cn(
          "flex cursor-pointer select-none items-center",
          !minimal && "text-body-sm font-medium",
        )}
      >
        <div className="relative">
          <Checkbox checked = {checked} onChange={onChange}/>
        </div>
        <span>{label}</span>
      </label>
    </div>
  );
}
