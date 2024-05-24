"use client";

import { useNewProductContext } from "@/context/newproduct.context";
import { Button } from "@nextui-org/react";
import React, { Dispatch, FC } from "react";

interface IProps {
  disable: boolean;
}
const PartsButtonsGroup: FC<IProps> = ({ disable }) => {
  const { part, setPart, setBack } = useNewProductContext();

  const onPreviousHandler = () => {
    setPart(part - 1);
    setBack(true);
  };
  return (
    <div className="flex justify-between">
      {part > 0 && (
        <Button className="button_secondary" onClick={onPreviousHandler}>
          Précédent
        </Button>
      )}

      <Button isDisabled={!disable} className="button_main" type="submit">
        Suivant
      </Button>
    </div>
  );
};

export default PartsButtonsGroup;
