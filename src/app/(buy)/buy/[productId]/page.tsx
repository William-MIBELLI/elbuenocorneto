import { auth } from "@/auth";
import AuthRequired from "@/components/auth-required/AuthRequired";
import Step1 from "@/components/buy/Step1";
import { BuyProductProvider } from "@/context/buyProduct.context";
import { getProductDetails } from "@/lib/requests/product.request";
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
      <Step1 product={product} />
    </div>
  );
};

export default page;
