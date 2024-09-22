import { acceptTransactionACTION } from "@/lib/actions/transaction.action";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { FC } from "react";

interface IProps {
  cancelHandler: () => void;
  transactionId: string;
}

const SellerInteraction: FC<IProps> = ({ cancelHandler, transactionId }) => {
  const { onOpen, isOpen, onOpenChange } = useDisclosure();

  const onAcceptTransaction = async () => {
    const t = await acceptTransactionACTION(transactionId);
    console.log("ACCEPT TRANSACTION : ", t);
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <Button onClick={onOpen} variant="bordered" color="success">
        Confirmer la vente
      </Button>
      <p
        onClick={cancelHandler}
        className="text-xs text-red-400 text-right font-semibold underline "
      >
        Décliner la vente
      </p>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Accepter la vente
              </ModalHeader>
              <ModalBody className="text-sm">
                <p>
                  En Acceptant la vente, le montant de la transaction sera
                  prélevé auprès de l'acheteur.
                </p>
                <p>
                  Ce montant vous sera versé une fois la livraison confirmée par
                  l'acheteur.
                </p>
                <p>
                  Si le mode de livraison choisi est{" "}
                  <span className="font-semibold text-main">
                    remise en main propre
                  </span>
                  , nous vous invitons a prendre rapidement contact avec
                  l'acheteur.
                </p>
                <p>
                  Pour tout autre mode de livraison, vous trouverez les
                  informations nécessaires en selectionnant la vente dans vos
                  transactions.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="button_main"
                  onPress={onAcceptTransaction}
                  onClick={onClose}
                >
                  Accepter la vente
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SellerInteraction;
