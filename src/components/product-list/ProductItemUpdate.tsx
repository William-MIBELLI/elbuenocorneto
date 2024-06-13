"use client";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import React, { FC, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AttributeSelect,
  CategorySelect,
  ImageSelect,
  LocationSelect,
  ProdAttrSelect,
  ProductSelect,
} from "@/drizzle/schema";
import { ProductUpdateType } from "@/interfaces/IProducts";
import SubmitButton from "../submit-button/SubmitButton";
import { useFormState } from "react-dom";
import { deleteProductAction } from "@/lib/actions/product.action";
import { RedirectType, redirect } from "next/navigation";

interface IProps {
  p: ProductUpdateType;
}

const ProductItemUpdate: FC<IProps> = ({ p }) => {

  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const [state, action] = useFormState(deleteProductAction.bind(null, { product: p }), { success: false })
  
  //SI DELETED OK, ON REDIRECT POUR REFRESH LA LIST DES PRODUCTS
  //PEUT ETRE VOIR SI IL N'Y A PAS UNE METHODE PLUS CLEAN
  useEffect(() => {
    if (state?.success) {
      redirect(`/mes-annonces`, RedirectType.replace)
    }
  },[state])

  return (
    <div className="p-3 flex items-center gap-4 w-full  relative">
      <div className="w-1/5 relative h-40">
        <Image
          src={p.images[0]?.url ?? "/image_placeholder.svg"}
          alt={p.title}
          fill
          className="rounded-lg"
        />
      </div>
      <div className="flex justify-between flex-grow">
        <div className="flex flex-col justify-between h-40">
          <div className="flex flex-col items-start gap-1 justify-start ">
            <h3 className="font-semibold my-0">{p.title}</h3>
            <p className="text-green-400 font-semibold">{p.price} €</p>
            <div className="text-xs bg-blue-200 text-blue-900 rounded-xl px-2">
              {p.categoryType}
            </div>
            <div className="flex gap-3">
              {p.attributes.map((attr) => (
                <div className="text-xs flex flex-col" key={attr.id}>
                  <p className="font-semibold">{attr.attribute.label}</p>
                  <p className="text-gray-500">{attr.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="text-left text-xs flex flex-col gap-3">
            <p>
              {p.location.city} - {p.location.postcode}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button className="button_danger" onClick={onOpen}>
            Supprimer
          </Button>
          <Button
            as={Link}
            href={`/update-product/${p.id}`}
            className="button_update"
          >
            Modifier
          </Button>
        </div>
      </div>

      {/* MODAL SUPPRESSION */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 ">Attention</ModalHeader>
              <ModalBody className="text-center">
                <div>
                  <p className="text-sm">
                    Vous êtes sur le point de supprimer votre annonce
                  </p>
                  <p className="font-semibold">
                    {p.title}
                  </p>
                </div>
                <p className="text-red-600 font-semibold">
                  Cette action est irréversible.
                </p>
              </ModalBody>
              <ModalFooter>
                <form className="w-full" action={action}>
                  <input type="text" hidden value={JSON.stringify(p)} name="productId" />
                  <SubmitButton fullWidth/>
                </form>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProductItemUpdate;
