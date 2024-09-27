"use client";
import { UserTransactionItem } from "@/lib/requests/transaction.request";
import { Button, Divider, Spinner } from "@nextui-org/react";
import { ChevronDown, HandHelping } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { FC, useState } from "react";
import Status from "./Status";
import { useSession } from "next-auth/react";
import BuyerInteraction from "./BuyerInteraction";
import SellerInteraction from "./SellerInteraction";
import { cancelTransactionACTION } from "@/lib/actions/transaction.action";
import DeliveryInfos from "./DeliveryInfos";
import { TransactionStatusEnum } from "@/drizzle/schema";

interface IProps {
  transaction: UserTransactionItem;
}

export const unEditableKeys: (typeof TransactionStatusEnum.enumValues)[number][] = [
  "CANCELED",
  "DONE",
];
const TransactionItem: FC<IProps> = ({ transaction }) => {
  const session = useSession();
  const [displayDeliveryInfos, setDisplayDeliveryInfos] =
    useState<boolean>(false);

  const onCancelClick = async () => {
    const res = await cancelTransactionACTION(transaction.id);
    console.log("COMMANDE ANNULEE : ", res);
  };

  if (!session?.data?.user?.id) {
    return <div></div>;
  }

  return (
    <div>
      <div className="grid grid-cols-5 gap-3 h-20 ">
        {/* LEFTSIDE */}
        <div className="col-span-1 relative flex">
          <Image
            src={
              transaction.product.images.length > 0
                ? transaction.product.images[0]?.url
                : "/image_placeholder.svg"
            }
            alt="img_product"
            fill
            className="object-contain"
          />
        </div>

        {/* DESCRIPTION */}
        <div className="col-span-3  text-left flex justify-between ">
          <div className="flex flex-col justify-between w-1/2">
            <div className="flex gap-4 font-semibold items-center ">
              <Link
                href={`/product/${transaction.productId}`}
                className="text-xl truncate"
              >
                {transaction.product?.title}
              </Link>
              <p className="text-green-400">{transaction.totalPrice}€</p>
            </div>
            <div className="flex flex-col justify-end">
              <p className="text-sm">
                Vendu par{" "}
                <Link
                  href={`/profile/${transaction.sellerId}`}
                  className="italic"
                >
                  {transaction.seller.name}
                </Link>
              </p>
              <p className="text-sm font-thin text-gray-400">
                Acheté le {transaction.createdAt?.toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between h-full text-end">
            <Status status={transaction.status!} />
            <span className="flex gap-1 text-xs font-semibold items-center justify-end">
              {transaction.delivery?.label || "Remise en main propre"}
              {transaction.deliveryMethod ? (
                <Image
                  src={transaction.delivery?.iconUrl!}
                  alt="delivery_icon"
                  width={20}
                  height={20}
                />
              ) : (
                <HandHelping size={23} />
              )}
            </span>
            {transaction.status === "ACCEPTED" && (
              <div
                className="text-xs flex bg-gray-200 px-2 rounded-lg items-center gap-2 py-0.5 cursor-pointer w-fit ml-auto"
                onClick={() => setDisplayDeliveryInfos((prev) => !prev)}
              >
                <p className="">Informations de livraison</p>
                <ChevronDown
                  size={15}
                  className={`transition-all ${
                    displayDeliveryInfos ? "rotate-180" : ""
                  }`}
                />
              </div>
            )}
          </div>
        </div>

        {/* INTERACTION */}
        <div className="col-span-1 flex items-center justify-center">
          <Divider orientation="vertical" className="mx-4" />
          {transaction.userId === session.data?.user?.id ? (
            <BuyerInteraction
              transaction={transaction}
              cancelClick={onCancelClick}
            />
          ) : (
            <SellerInteraction
              cancelHandler={onCancelClick}
              transaction={transaction}
            />
          )}
        </div>
      </div>

      {/* DELIVERY INFOS */}
      {displayDeliveryInfos && transaction.status === "ACCEPTED" && (
        <DeliveryInfos transaction={transaction} />
      )}
      <Divider className="my-3" />
    </div>
  );
};

export default TransactionItem;
