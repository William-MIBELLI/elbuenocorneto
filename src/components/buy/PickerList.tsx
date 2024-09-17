import { IPickerShop } from "@/interfaces/ILocation";
import React, { FC } from "react";
import PickerListItem from "./PickerListItem";
import { Radio, RadioGroup } from "@nextui-org/react";
import { useBuyProductContext } from "@/context/buyProduct.context";

interface IProps {
  servicePoints: IPickerShop[];
}

const PickerList: FC<IProps> = ({ servicePoints }) => {
  const { pickers, setSelectedPicker, selectedPicker } = useBuyProductContext();

  const onChangeHandler = (value: string) => {
    if (!pickers) {
      return;
    }
    const picker = pickers.find((item) => item.id === +value);
    setSelectedPicker(picker);
  };

  return (
    <RadioGroup
      className="max-h-80 overflow-y-auto overflow-x-hidden my-4"
      value={selectedPicker?.id.toString()}
      onValueChange={onChangeHandler}
    >
      {servicePoints.map((service) => (
        <Radio
          key={service.id}
          value={service.id.toString()}
          classNames={{
            base: ["min-w-full flex items-start justify-start p-3"],
            labelWrapper: ["w-full"],
            label: [" min-w-full p-0 -mt-1"],
          }}
        >
          <PickerListItem picker={service} />
        </Radio>
      ))}
    </RadioGroup>
  );
};

export default PickerList;
