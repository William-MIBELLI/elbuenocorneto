import React, { FC } from "react";
import StarItem from "./StarItem";

interface IProps {
  rating: number;
  totalRate?: number;
}

export type ValueType = "FULL" | "HALF" | "EMPTY";

const Rating: FC<IProps> = ({ rating, totalRate }) => {
  const starValues: ValueType[] = [];
  const rate = rating * 10;
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
    <div className="flex justify-between items-center gap-1">
      <div className="flex">
        {starValues.map((value) => (
          <StarItem value={value} key={Math.random()} />
        ))}
      </div>
      {
        totalRate &&
        <p className="text-sm font-semibold">({totalRate})</p>
      }
    </div>
  );
};

export default Rating;
