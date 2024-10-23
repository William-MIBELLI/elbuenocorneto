"use client";
import { IRatingList } from "@/lib/requests/rate.request";
import React, { FC } from "react";
import Rating from "./Rating";
import Image from "next/image";

interface IProps {
  list: IRatingList;
}

const RatingList: FC<IProps> = ({ list }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {list &&
        list.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between text-sm  w-full p-5 border-1  rounded-lg"
          >
            <div className="flex flex-col justify-start items-start text-sm gap-2">
              <div className="flex items-center gap-1">
                <p>Par : {item.transaction.user.name}</p>
                <Image
                  src={item.transaction.user.image || "/profile-default.svg"}
                  alt="user_image"
                  height={20}
                  width={20}
                />
              </div>
              <p>Le : {item.transaction.createdAt?.toLocaleDateString()}</p>
            </div>
            <div className="flex flex-col items-end w-2/3">
              <Rating key={item.id} rating={item.rate} />
              <p>{item.commentary}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default RatingList;
