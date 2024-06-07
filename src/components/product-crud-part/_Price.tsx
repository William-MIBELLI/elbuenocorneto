import { Checkbox } from "@nextui-org/react";
import { Euro } from "lucide-react";
import React, { FC, useEffect, useState } from "react";
import UncontrolledInput from "../inputs/UncontrolledInput";
import { check } from "drizzle-orm/mysql-core";

interface IProps {
  previousPrice?: number;
  name?: string
}

const _Price: FC<IProps> = ({ previousPrice, name }) => {

  const [price, setPrice] = useState(previousPrice ?? 0);
  const [check, setCheck] = useState(false);

  // useEffect(() => {
  //   if (check) {
  //     setPrice(0);
  //   }
  // },[check])

  return (
    <fieldset>
      <Checkbox
        defaultSelected={price === 0}
        onValueChange={(isChecked) => setCheck(isChecked)}
      >
        Je fais un don
      </Checkbox>
      <UncontrolledInput
        label="Votre prix de vente"
        type="number"
        name={name ?? 'price'}
        defaultValue={previousPrice?.toString()}
        min={1}
        isDisabled={check}
        value={check ? '0' : price.toString()}
        onChange={(e) => setPrice(+e.target.value)}
        classNames={{
          inputWrapper: [check ? "bg-gray-300" : null],
        }}
        endContent={
          <div className="flex gap-2">
            <Euro size={17} />
          </div>
        }
      />
    </fieldset>
  );
};

export default _Price;
