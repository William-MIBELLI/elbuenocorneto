import { Input, InputProps } from "@nextui-org/react";
import React, { FC } from "react";

interface IProps extends InputProps {
  name: string;
  label: string;
  required?: boolean;
  type?: 'text' | 'password' | 'email' | 'search' | 'number';
  defaultValue?: string;
  errors?: string[];
}


const UncontrolledInput: FC<IProps> = ({
  label,
  name,
  type = 'text',
  required = true,
  defaultValue = undefined,
  errors,
  ...rest
}) => {
  return (
    <div className="flex flex-col items-start">
      <label htmlFor={name}>{`${label} ${required ? '*' : ''}`}</label>
      <Input
        type={type}
        isRequired={required}
        name={name}
        defaultValue={defaultValue}
        classNames={{
          inputWrapper: "border bg-transparent",
        }}
        {...rest}
      />
      {
        errors && (
          <p className="error_message">
            {errors.join(', ')}
          </p>

        )
      }
    </div>
  );
};

export default UncontrolledInput;
