import { ProdAttrTypeWithName } from "@/context/newproduct.context";
import { AttributeSelect } from "@/drizzle/schema";
import { Select, SelectItem } from "@nextui-org/react";
import React, { FC, useEffect, useState } from "react";

interface IProps {
  attribute: AttributeSelect;
  name: string;
  errors?: string[];
  state: ProdAttrTypeWithName[];
  // onChangeHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const AttributeSelectInput: FC<IProps> = ({
  attribute,
  name,
  errors,
  state,
  // onChangeHandler,
}) => {
  const { possibleValue, label } = attribute;
  const mappedValue = possibleValue?.map((item, index) => {
    return {
      key: item ?? index,
      label: item ?? index,
    };
  });
  const [value, setValue] = useState<string>();

  //SI DES VALUES SONT DEJA STOCKEES DANS LE CONTEXT, ON PRE-REMPLI LE SELECT
  useEffect(() => {
    const existingState = state.find((item) => item.label === attribute.label);
    if (existingState) {
      setValue(existingState.value);
    }
  }, [state]);

  //SI PAS DE VALUES POSSIBLE, ON DISPLAY UNE ERREUR
  if (!mappedValue) {
    return (
      <div className="text-center w-full">
        <p className="error_message">
          Une erreur est survenue pendant la récupération des données.
        </p>
      </div>
    );
  }


  return (
    <div className="text-left">
      <label htmlFor={name}>{`${label} ${
        attribute.required ? "*" : ""
      }`}</label>
      <Select
        name={name}
        variant="bordered"
        aria-label={label}
        value={value}
        selectedKeys={[value ?? ""]}
        onChange={e => setValue(e.target.value)}
        // onChange={onChangeHandler}
      >
        {mappedValue &&
          mappedValue.map((item) => (
            <SelectItem key={item.key}>{item.label}</SelectItem>
          ))}
      </Select>
      {errors && <p className="error_message">{errors.join(", ")}</p>}
    </div>
  );
};

export default AttributeSelectInput;
