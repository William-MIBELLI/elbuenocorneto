import { auth } from "@/auth";
import AuthRequired from "@/components/auth-required/AuthRequired";
import ProductItemUpdate from "@/components/product-list/ProductItemUpdate";
import { getProductsForUpdateList } from "@/lib/requests/product.request";
import { Button, Divider } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async () => {
  const session = await auth();

  if (!session || !session?.user) {
    return <AuthRequired />;
  }
  const prods = await getProductsForUpdateList(session.user.id!);


  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold text-left my-5">Toutes mes annonces</h1>
      <div className=" flex flex-col gap-3 text-wrap">
        {prods &&
          prods.map((p) => (
            <div key={p.id}>
              <ProductItemUpdate p={p} />
              <Divider className="" />
            </div>
          ))}
      </div>
    </div>
  );
};

export default page;
