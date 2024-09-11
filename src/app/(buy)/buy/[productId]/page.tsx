import { auth } from "@/auth";
import AuthRequired from "@/components/auth-required/AuthRequired";
import StepDisplayer from "@/components/buy/StepDisplayer";
import { BuyProductProvider } from "@/context/buyProduct.context";
import { getProductDetails } from "@/lib/requests/product.request";
import Image from "next/image";
import React, { FC } from "react";

interface IProps {
  params: {
    productId: string;
  };
}

const page: FC<IProps> = async ({ params: { productId } }) => {
  const session = await auth();

  if (!session?.user?.id) {
    return <AuthRequired />;
  }

  const product = await getProductDetails(productId);

  //ON CHECK QUE LE PRODUCT EXISTE ET QU'IL N'APPARTIENT PAS A L'USER
  if (!product || product.seller.id === session.user.id) {
    return <div>Impossible d'afficher ce produit</div>;
  }

  return (
    <div className="w-full">
      {/* <Step1 product={product} /> */}
      <StepDisplayer product={product} />
      <Image
        className="fixed bottom-0 right-0 z-10"
        src="/buy_product_bg.svg"
        alt="bg"
        width={800}
        height={800}
      />
    </div>
  );
};

export default page;
