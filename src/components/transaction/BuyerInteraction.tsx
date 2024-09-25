import { confirmReceptionTransactionACTION } from "@/lib/actions/transaction.action";
import { UserTransactionItem } from "@/lib/requests/transaction.request";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Check } from "lucide-react";
import Link from "next/link";
import React, { FC } from "react";

interface IProps {
  transaction: UserTransactionItem;
  cancelClick: () => void;
}

const BuyerInteraction: FC<IProps> = ({ transaction, cancelClick }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const onConfirmReception = async () => {
    const res = await confirmReceptionTransactionACTION(transaction.id);
    console.log('RES ON CONFIRM RECEPTION : ', res);
  }

  return (
    <div className="flex flex-col h-full w-3/4 justify-between">
      {transaction.status === "CREATED" ? (
        <Button
          as={Link}
          href={`/conversation/${transaction.productId}`}
          variant="bordered"
          size="sm"
        >
          Contacter le vendeur
        </Button>
      ) : (
        <Button
          onClick={onConfirmReception}
          variant="bordered"
          color="success"
          size="sm"
          endContent={<Check size={15} />}
        >
          Confirmer la vente
        </Button>
      )}
      {
        
      }
      <p
        onClick={onOpen}
        className="text-xs text-red-500 font-semibold text-right underline cursor-pointer"
      >
        Annuler la vente
      </p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Annulation de commande
              </ModalHeader>
              <ModalBody className="text-sm">
                <p>
                  La commande n'ayant pas été encore confirmée par le vendeur,
                  vous avez la possibilité de l'annuler sans frais.
                </p>
                <p>
                  La somme réservée sur votre moyen de paiement ne sera pas
                  prélevée.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={cancelClick}
                  className="button_main"
                  onPress={onClose}
                >
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
