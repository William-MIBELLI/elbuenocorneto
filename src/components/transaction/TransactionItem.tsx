import { UserTransactionItem } from "@/lib/requests/transaction.request";
import { Button, Divider } from "@nextui-org/react";
import { HandHelping } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import Status from "./Status";

interface IProps {
  transaction: UserTransactionItem;
}
const TransactionItem: FC<IProps> = ({ transaction }) => {

  return (
    <div>
      <div className="grid grid-cols-5 gap-3  h-20">
        {/* LEFTSIDE */}
        <div className="col-span-1 relative flex">
          <Image
            src={
              transaction.product.images
                ? transaction.product.images[0].url
                : "/image_placeholder.svg"
            }
            alt="img_product"
            fill
            className="object-contain"
          />
        </div>

        {/* DESCRIPTION */}
        <div className="col-span-3  text-left flex justify-between  ">
          <div className="flex flex-col justify-between w-1/2">
            <div className="flex gap-4 font-semibold items-center">
              <h2 className="text-xl">{transaction.product?.title}</h2>
              <p className="text-green-400">{transaction.totalPrice}€</p>
            </div>
            <div className="flex flex-col justify-end">
              <p className="text-sm">
                Vendu par <span className="italic">{transaction.seller.name}</span>
              </p>
              <p className="text-sm font-thin text-gray-400">
                Acheté le {transaction.createdAt?.toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between h-full text-end">
            <Status status={transaction.status!}/>
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
                    <HandHelping size={23}/>
              )}
              </span>
            <div className="">
            </div>
          </div>
        </div>

        {/* INTERACTION */}
        <div className="col-span-1 flex items-center justify-center">
          <Divider orientation="vertical" className="mx-4"/>
          <Button as={Link} href={`/conversation/${transaction.productId}`} variant="bordered">Contacter le vendeur</Button>
        </div>
      </div>
      <Divider className="my-3" />
    </div>
  );
};

export default TransactionItem;
