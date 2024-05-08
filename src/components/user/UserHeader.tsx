import { SelectUser } from "@/drizzle/schema";
import React, { FC } from "react";
import Rating from "../rating/Rating";
import { Avatar } from "@nextui-org/react";

interface IProps {
  userData: Partial<
    Pick<SelectUser, "name" | "rateNumber" | "rating" | "image">
  >;
  count?: number
}

const UserHeader: FC<IProps> = ({ userData, count }) => {
  const { name, rating, rateNumber } = userData;
  return (
    <div className="flex gap-3">
      <Avatar size="lg" />
      <div className="flex flex-col justify-center items-start">
        <h3 className="font-semibold text-lg">{name}</h3>
        {count && (
          <p className="text-sm">{count} annonces</p>
        )}
        {rating && rateNumber && (
          <Rating rating={rating} totalRate={rateNumber} />
        )}
        <div></div>
      </div>
    </div>
  );
};

export default UserHeader;
