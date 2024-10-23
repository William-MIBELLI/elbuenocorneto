"use client";
import { createRatingACTION } from "@/lib/actions/rating.action";
import { Textarea, Button } from "@nextui-org/react";
import { CheckCircle, Star } from "lucide-react";
import React, { FC, useEffect, useState } from "react";
import { useFormState } from "react-dom";

interface IProps {
  transactionId: string;
}

const CreateRating: FC<IProps> = ({ transactionId }) => {
  const [currentHover, setCurrentHover] = useState<number>();
  const [selectedRating, setSelectedRating] = useState<number>(0);

  const getStyle = (index: number) => {
    const styleFill = "fill-orange-500 text-orange-500";
    const styleEmpty = "fill-gray-200 text-gray-200";
    if (currentHover !== undefined) {
      if (currentHover >= index) {
        return styleFill;
      }
      return styleEmpty;
    }
    if (selectedRating !== undefined) {
      if (selectedRating >= index) {
        return styleFill;
      }
      return styleEmpty;
    }
    return styleEmpty;
  };

  const [state, action] = useFormState(
    createRatingACTION,
    undefined
  );

  useEffect(() => {
    if (state?.success) {

    }
  }, [state]);

  if (state?.success) {
    return <div className="flex items-center">
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold">
          Votre évaluation a bien été prise en compte
        </p>
        <CheckCircle className="text-green-500"/>
      </div>
    </div>
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="text" hidden defaultValue={transactionId} name="transactionId" />
      <input type="number" hidden value={selectedRating + 1} name="rate" />
      <div>
        <h2 className="text-sm">Votre note</h2>
        <div className="flex" onMouseLeave={() => setCurrentHover(undefined)}>
          {Array(5)
            .fill(0)
            .map((item, index) => (
              <Star
                key={index}
                strokeWidth={undefined}
                strokeOpacity={0}
                onMouseEnter={() => setCurrentHover(index)}
                onClick={() => setSelectedRating(index)}
                className={`${getStyle(index)} cursor-pointer`}
              />
            ))}
          <p className="ml-auto font-semibold">
            {(selectedRating || 0) + 1} / 5
          </p>
        </div>
      </div>
      <Textarea
        name="commentary"
        label="Votre commentaire"
        variant="bordered"
        labelPlacement="outside"
      />
      <Button type="submit" className="bg-blue-900 text-white font-semibold">
        Valider
      </Button>
    </form>
  );
};

export default CreateRating;
