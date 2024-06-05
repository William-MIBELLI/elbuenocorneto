"use client";

import { partList, useNewProductContext } from "@/context/newproduct.context";
import { Button } from "@nextui-org/react";
import React, { Dispatch, FC } from "react";

interface IProps {
  disable: boolean;
}
const PartsButtonsGroup: FC<IProps> = ({ disable }) => {
  const { part, setPart, setBack, isComplete, totalPart } =
    useNewProductContext();
  
  const getNextPart = (forward: boolean) => {
    const index = partList.findIndex(item => item === part);
    if (index === -1) {
      return 'title'
    }
    const next = forward ? partList[index + 1] : partList[index - 1];
    return next
  }

  const onClickHandler = (forward: boolean) => {
    setPart(getNextPart(forward));
    setBack(true);
  };
  return (
    <div className="flex justify-between">
      {part !== 'title' && (
        <Button className="button_secondary" onClick={() => onClickHandler(false)}>
          Précédent
        </Button>
      )}
      <div className="flex gap-3">
        {isComplete ? (
          <Button
            isDisabled={!disable}
            className="bg-blue-900 text-white font-semibold"
            type="button"
            onClick={() => setPart('validation')}
          >
            Retourner au récapitulatif
          </Button>
        ) : (
          <Button isDisabled={!disable} className="button_main" type="submit">
            Suivant
          </Button>
        )}
      </div>
    </div>
  );
};

export default PartsButtonsGroup;
