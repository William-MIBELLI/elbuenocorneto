import { Divider, Input } from "@nextui-org/react";
import { Smartphone } from "lucide-react";
import React, { FC } from "react";

interface IProps {
  value: string;
  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string[];
  bordered?: boolean;
}

const PhoneInput: FC<IProps> = ({
  value,
  onChangeHandler,
  error,
  bordered,
}) => {
  return (
    <div className="flex flex-col items-start">
      <label htmlFor="phone">Votre numéro de téléphone</label>
      <Input
        type="number"
        name="phone"
        variant={bordered ? "bordered" : undefined}
        value={value}
        onChange={onChangeHandler}
        startContent={
          <div className="flex items-center text-xs  h-full py-1">
            <Smartphone size={17} />
            <p>+33</p>
            <Divider orientation="vertical" className="ml-2" />
          </div>
        }
      />
      {error && <p className="error_message">{error.join(", ")};</p>}
    </div>
  );
};

export default PhoneInput;
