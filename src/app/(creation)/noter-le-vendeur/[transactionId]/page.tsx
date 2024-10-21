import { auth } from "@/auth";
import AuthRequired from "@/components/auth-required/AuthRequired";
import Seller from "@/components/product-details/Seller";
import CreateRating from "@/components/rating/CreateRating";
import {
  getTransaction,
  getTransactionForRate,
} from "@/lib/requests/transaction.request";
import { Button, Radio, RadioGroup, Textarea } from "@nextui-org/react";
import { Star } from "lucide-react";
import Image from "next/image";
import React, { FC } from "react";

interface IProps {
  params: {
    transactionId: string;
  };
}

const page: FC<IProps> = async ({ params: { transactionId } }) => {
  const session = await auth();

  if (!session?.user?.id) {
    return <AuthRequired />;
  }

  const data = await getTransactionForRate(transactionId);

  if (!data || data?.transaction.userId !== session.user.id) {
    return <div>Vous ne pouvez pas noter ce vendeur</div>;
  }

  if (data.rating) {
    return <div>
      Cette transaction a déja été notée
    </div>
  }

  return (
    <div className="flex flex-col my-4 text-left w-full">
      <h1 className="font-semibold text-2xl">
        Comment s'est passé votre achat ?
      </h1>
      <p className="text-sm text-gray-400">
        Vous pouvez donner une note au vendeur et laisser un commentaire, cela
        permettra aux autres utilisateurs de se décider plus facilement.
      </p>
      <div className="w-full grid grid-cols-2 gap-3 mt-8">
        <div className=" flex flex-col mx-auto h-fit my-auto gap-4">
          <div className="flex items-center justify-between">
            <Image
              src={data?.user?.image || "/profile-default.svg"}
              alt="user-image"
              height={80}
              width={80}
            />
            <h3 className="font-semibold text-xl">
              {data?.user?.name}
            </h3>
          </div>
          <div>
            <p className="font-thin text-gray-400 underline">
              La transaction concernait :
            </p>
            <p className="text-center font-semibold">
              {
                data.transaction.productTitle
              }
            </p>
          </div>
        </div>
        <CreateRating transactionId={data.transaction.id} />
      </div>
    </div>
  );
};

export default page;
