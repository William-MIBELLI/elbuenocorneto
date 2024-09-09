import { Input, InputProps } from "@nextui-org/react";
import React, { FC } from "react";

interface IProps extends InputProps {
  name: string;
  label: string;
  required?: boolean;
  type?: 'text' | 'password' | 'email' | 'search' | 'number';
  defaultValue?: string;
  errors?: string[];
  colSpan?: number;
}


const UncontrolledInput: FC<IProps> = ({
  label,
  name,
  type = 'text',
  required = true,
  defaultValue = undefined,
  errors,
  colSpan,
  ...rest
}) => {
  return (
    <div className={`flex flex-col items-start ${colSpan ? `col-span-${colSpan}` : null }`} >
      <label htmlFor={name}>{`${label} ${required ? '*' : ''}`}</label>
      <Input
        type={type}
        isRequired={required}
        name={name}
        defaultValue={defaultValue}
        classNames={{
          inputWrapper: `border bg-transparent`,
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
