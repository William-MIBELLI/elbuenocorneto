import React, { FC } from "react";
import StarItem from "./StarItem";

interface IProps {
  rate: number;
  totalRate: number;
}

export type ValueType = "FULL" | "HALF" | "EMPTY";

const Rating: FC<IProps> = ({ rate, totalRate }) => {
  const starValues: ValueType[] = [];

  for (let i = 10; i <= 50; i += 10) {
    if (rate >= i || i - rate < 3) {
      starValues.push("FULL");
    } else if (i - rate >= 8) {
      starValues.push("EMPTY");
    } else {
      // console.log('HALF : ', i - rate, i, rate)
      starValues.push("HALF");
    }
  }

  // console.log('rate : ', rate, starValues);

  return (
    <div className="flex w-full justify-between items-center">
      <div className="flex">
        {starValues.map((value) => (
          <StarItem value={value} key={Math.random()} />
        ))}
      </div>
      <p className="text-sm font-semibold">({totalRate})</p>
    </div>
  );
};

export default Rating;
