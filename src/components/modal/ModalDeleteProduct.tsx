"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import React, { Dispatch, FC, useEffect } from "react";
import SubmitButton from "../submit-button/SubmitButton";
import { ProductUpdateType } from "@/interfaces/IProducts";
import { deleteProductAction } from "@/lib/actions/product.action";
import { redirect, RedirectType } from "next/navigation";
import { useFormState } from "react-dom";
import { ProductSelect } from "@/drizzle/schema";

interface IProps {
  open: boolean;
  setOpen: Dispatch<boolean>;
  product: ProductSelect;
  redirectPath?: string;
  redirection: boolean
}
const ModalDeleteProduct: FC<IProps> = ({
  open,
  setOpen,
  product,
  redirection,
  redirectPath = "/mes-annonces",
}) => {
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  const [state, action] = useFormState(
    deleteProductAction.bind(null, { product, redirectPath, redirection }),
    { success: false }
  );

  //SI DELETED OK, ON REDIRECT POUR REFRESH LA LIST DES PRODUCTS
  //PEUT ETRE VOIR SI IL N'Y A PAS UNE METHODE PLUS CLEAN
  useEffect(() => {
    console.log("ON REDIRECT : ", redirectPath, state);
    if (state?.success) {
      redirect(redirectPath, RedirectType.replace);
    }
  }, [state]);

  //ON DECLENCHE ONOPEN DEPUIS LE PARENT
  useEffect(() => {
    if (open) {
      onOpen();
    }
  }, [open]);

  //SI ON CLOSE LA MODAL, ON MET LE STAT OPEN DU PARENT A FALSE
  const onCloseHandler = () => {
    console.log('ONCLOSE HANDLER');
    setOpen(false);
    onClose();
  };

 
  return (
    <Modal isOpen={isOpen} onClose={onCloseHandler} onOpenChange={onOpenChange} >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 ">
              Attention
            </ModalHeader>
            <ModalBody className="text-center">
              <div>
                <p className="text-sm">
                  Vous êtes sur le point de supprimer votre annonce
                </p>
                <p className="font-semibold">{product.title}</p>
              </div>
              <p className="text-red-600 font-semibold">
                Cette action est irréversible.
              </p>
            </ModalBody>
            <ModalFooter>
              <form className="w-full" action={action}>
                <SubmitButton fullWidth text="Supprimer mon annonce" />
              </form>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalDeleteProduct;
