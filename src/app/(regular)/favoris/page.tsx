import { auth } from "@/auth";
import AuthRequired from "@/components/auth-required/AuthRequired";
import ProductItem from "@/components/product-list/ProductItem";
import { ProductDataForList } from "@/interfaces/IProducts";
import { getFavoritesByUserId } from "@/lib/requests/favorite.request";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async () => {
  const session = await auth();

  if (!session || !session.user) {
    return <AuthRequired />;
  }

  const favorites = await getFavoritesByUserId(session.user.id!);

  return (
    <div className="w-full flex flex-col gap-3 text-left">
      <div className="my-3">
        <h1 className="text-3xl font-bold w-full">Vos annonces favorites</h1>
        {favorites.length ? (
          <>
            <p className="text-gray-300 mb-4">
              {favorites.length > 1
                ? favorites.length + " annonces sélectionnées"
                : favorites.length + " annonce sélectionnée"}
            </p>
            <div className="flex flex-col gap-3">
              {favorites.map((fav) => (
                <ProductItem data={fav} key={Math.random()} />
              ))}
            </div>
          </>
        ) : (
            <div className="flex w-full flex-col justify-center items-center gap-4">
              <p className="text-gray-300 ">
                Vous n'avez pas encore d'annonces favorites
              </p>
              <Button as={Link} href="/search-result/?keyword=chats" className="button_main">Faire une nouvelle recherche</Button>
              <Image src='/images/fav_search.jpg' alt='search image' height={150} width={150}/>
            </div>
        )}
      </div>
    </div>
  );
};

export default page;
