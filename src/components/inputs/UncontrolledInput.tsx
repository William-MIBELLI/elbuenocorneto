import { Input } from "@nextui-org/react";
import React, { FC } from "react";

interface IProps {
  name: string;
  label: string;
  required?: boolean;
  type?: 'text' | 'password' | 'email' | 'search' | 'number';
  defaultValue?: string;
}

const UncontrolledInput: FC<IProps> = ({
  label,
  name,
  type = 'text',
  required = true,
  defaultValue = undefined
}) => {
  return (
    <div className="flex flex-col items-start">
      <label htmlFor={name}>{label}</label>
      <Input
        type={type}
        isRequired={required}
        name={name}
        defaultValue={defaultValue}
        classNames={{
          inputWrapper: "border bg-transparent",
        }}
      />
    </div>
  );
};

export default UncontrolledInput;
