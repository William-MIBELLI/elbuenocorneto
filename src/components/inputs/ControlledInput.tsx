import { Input, InputProps } from "@nextui-org/react";
import React, { FC } from "react";

interface IProps extends InputProps {
  value: string;
  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
  required?: boolean;
  type?: 'text' | 'password' | 'email' | 'search' | 'numeric';
}

const ControlledInput: FC<IProps> = ({
  label,
  name,
  onChangeHandler,
  value,
  type = 'text',
  required = true,
  ...rest
}) => {
  return (
    <div className="text-left">
      <label htmlFor={name}>{label}</label>
      <Input
        type={type}
        isRequired={required}
        name={name}
        value={value}
        onChange={onChangeHandler}
        classNames={{
          inputWrapper: "border bg-transparent",
        }}
        {...rest}
      />
    </div>
  );
};

export default ControlledInput;
