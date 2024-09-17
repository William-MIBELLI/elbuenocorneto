import { SelectUser } from "@/drizzle/schema";
import React, { FC } from "react";
import Rating from "../rating/Rating";
import { Avatar } from "@nextui-org/react";
import Image from "next/image";

interface IProps {
  userData: Partial<
    Pick<SelectUser, "name" | "rateNumber" | "rating" | "image">
  >;
  count?: number;
}

const UserHeader: FC<IProps> = ({ userData, count }) => {
  const { name, rating, rateNumber, image } = userData;
  return (
    <div className="flex gap-3">
      {!image ? (
        <Avatar size="lg" />
      ) : (
        <div className="relative w-14 h-14">
          <Image src={image} alt="user_image" fill className="rounded-full" />
        </div>
      )}
      <div className="flex flex-col justify-center items-start">
        <h3 className="font-semibold text-lg">{name}</h3>
        {count && <p className="text-sm">{count} annonces</p>}
        {rating && rateNumber && (
          <Rating rating={rating} totalRate={rateNumber} />
        )}
        <div></div>
      </div>
    </div>
  );
};

export default UserHeader;
