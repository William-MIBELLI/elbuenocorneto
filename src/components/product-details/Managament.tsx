"use client";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import React, { FC, useState } from "react";
import ModalDeleteProduct from "../modal/ModalDeleteProduct";
import { ProductSelect } from "@/drizzle/schema";

interface IProps {
  product: ProductSelect;
}
const Managament: FC<IProps> = ({ product }) => {
  const [open, setOpen] = useState(false);

  const onClickhandler = () => {
    setOpen(true);
  };
  return (
    <div className="w-full flex flex-col gap-4 p-3 border-1 rounded-lg shadow-medium">
      <h3 className="font-semibold">Gérer votre annonce</h3>
      <Button
        as={Link}
        href={`/update-product/${product.id}`}
        className="button_secondary"
      >
        Modifier
      </Button>
      <Button className="button_danger" onClick={onClickhandler}>
        Supprimer
      </Button>
      <ModalDeleteProduct
        setOpen={setOpen}
        open={open}
        product={product}
        redirectPath="/"
        redirection={true}
      />
    </div>
  );
};

export default Managament;
