import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import React, { FC } from "react";

interface IProps {
  productId: string;
  cancelClick: () => void
}

const BuyerInteraction: FC<IProps> = ({ productId, cancelClick }) => {
  
  const { isOpen, onOpen, onOpenChange } = useDisclosure();



  return (
    <div className="flex flex-col h-full justify-between">
      <Button
        as={Link}
        href={`/conversation/${productId}`}
        variant="bordered"
      >
        Contacter le vendeur
      </Button>
      <p onClick={onOpen} className="text-xs text-red-500 font-semibold text-right underline cursor-pointer">
        Annuler la vente
      </p>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Annulation de commande</ModalHeader>
              <ModalBody className="text-sm">
                <p > 
                  La commande n'ayant pas été encore confirmée par le vendeur, vous avez la possibilité de l'annuler sans frais.
                </p>
                <p>
                  La somme réservée sur votre moyen de paiement ne sera pas prélevée.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button onClick={cancelClick} className="button_main" onPress={onClose}>
                  Annuler ma commande
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default BuyerInteraction;
