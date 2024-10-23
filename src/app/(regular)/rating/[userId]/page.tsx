import RatingList from "@/components/rating/RatingList";
import { getRatesDetails } from "@/lib/requests/rate.request";
import React, { FC } from "react";

interface IProps {
  params: {
    userId: string;
  };
}

const page: FC<IProps> = async ({ params: { userId } }) => {
  const data = await getRatesDetails(userId);

  console.log("DATA : ", data);
  return (
    <div className="w-full">
      <h1 className="text-2xl text-left font-semibold my-5">
        Les évaluations de {data[0].transaction.seller.name}
      </h1>
      <RatingList list={data} />
    </div>
  );
};

export default page;
