import { IPickerShop } from "@/interfaces/ILocation";
import React, { FC } from "react";
import PickerListItem from "./PickerListItem";
import { Radio, RadioGroup } from "@nextui-org/react";
import { useBuyProductContext } from "@/context/buyProduct.context";

interface IProps {
  servicePoints: IPickerShop[];
}

const PickerList: FC<IProps> = ({ servicePoints }) => {
  const {
    pickers,
    setSelectedPicker,
    selectedPicker,
    displayPickersList,
    setDisplayPickersList,
    personalInfoRef,
  } = useBuyProductContext();

  const onChangeHandler = (value: string) => {
    if (!pickers) {
      return;
    }
    const picker = pickers.find((item) => item.id === +value);
    setSelectedPicker(picker);
    setDisplayPickersList(false);
    if (personalInfoRef) {
      personalInfoRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  return (
    <div className="max-h-80 pickers_list h-auto overflow-y-auto overflow-x-hidden mt-4 transition-all">
      <RadioGroup
        className=""
        value={selectedPicker?.id.toString()}
        onValueChange={onChangeHandler}
      >
        {(displayPickersList && servicePoints) ? (
          servicePoints.map((service) => (
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
          ))
        ) : selectedPicker ? (
          <Radio
            key={selectedPicker.id}
            value={selectedPicker.id.toString()}
            classNames={{
              base: ["min-w-full flex items-start justify-start  box-border"],
              labelWrapper: ["w-full"],
              label: [" min-w-full p-0 -mt-1"],
            }}
          >
            <PickerListItem picker={selectedPicker} />
          </Radio>
        ) : null}
      </RadioGroup>
      {selectedPicker && !displayPickersList && (
        <p
          className=" mt-4 text-center cursor-pointer text-xs font-semibold"
          onClick={() => setDisplayPickersList(true)}
        >
          voir plus
        </p>
      )}
    </div>
  );
};

export default PickerList;
