'use client';
import { ICardDashboard } from "@/app/(regular)/dashboard/page";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { FC } from "react";

interface IProps {
  card: ICardDashboard;
}

const Card: FC<IProps> = ({
  card: { title, content, iconUrl, target, available = false },
}) => {

  const router = useRouter();

  const onClickHandler = () => {
    if (available) {
      router.push(target);
    }
  }

  return (
    <div
      onClick={onClickHandler}
        className={`flex  ${content ? "flex-col" : "gap-1"} ${
          available ? "cursor-pointer" : "bg-gray-50 text-gray-200 cursor-default"
        } items-start p-6 py-7 rounded-lg shadow-dashboard_card h-full`}
      >
        <Image
          src={`/images/dashboard/${iconUrl}`}
          alt={title}
          width={40}
          height={40}
        />
        <h3 className="font-semibold mt-2">{title}</h3>
        <p className="text-sm text-left">{content}</p>
      </div>
  );
};

export default Card;
