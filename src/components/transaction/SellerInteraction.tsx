import { transactionConversationACTION } from "@/lib/actions/conversation.action";
import { acceptTransactionACTION } from "@/lib/actions/transaction.action";
import { createParcel, getParcel } from "@/lib/requests/sendCloud.request";
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
import { useRouter } from "next/navigation";
import React, { FC } from "react";

interface IProps {
  cancelHandler: () => void;
  transaction: UserTransactionItem;
}

const SellerInteraction: FC<IProps> = ({
  cancelHandler,
  transaction
}) => {
  const { onOpen, isOpen, onOpenChange } = useDisclosure();
  const { parcelId } = transaction;
  const router = useRouter();


  //CLICK POUR ACCEPTER LA TRANSACTION
  const onAcceptTransaction = async () => {
    const t = await acceptTransactionACTION(transaction.id);
    console.log("ACCEPT TRANSACTION : ", t);
  };

  //CLICK POUR DL L'ETIQUETTE DE LIVRAISON
  const onDownloadParcel = async () => {
    if (!parcelId) {
      return;
    }

    //ON RECUPERE LE PDF EN BASE64
    const parcel = await getParcel(parcelId);

    //ON CREE UN LIEN TEMPORAIRE QUI POINTE VERS LE FICHIER
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${parcel}`;
    link.download = `parcel-label-${parcelId}.pdf`;
    document.body.appendChild(link);

    //ON TRIGGER LE CLICK
    link.click();

    //ON LE REMOVE
    document.body.removeChild(link);
  };

  const onGoToConversation = async () => {
    const res = await transactionConversationACTION(transaction);
    if (!res) {
      console.log('RES NULL');
    }
    router.push(`/messages/${res}`);
  }

  //SI ON A UN PARCEL ID ET QUE LA TRANSACTION EST ACCEPTED
  if (parcelId && transaction.status === 'ACCEPTED') {
    return (
      <Button size="sm" onClick={onDownloadParcel} className="whitespace-normal h-fit" variant="bordered" color="primary">
        Imprimer l'étiquette de livraison
      </Button>
    );
  }

  if (transaction.status === 'ACCEPTED' && !transaction.deliveryMethod) {
    return (
      <Button variant="bordered" onClick={onGoToConversation}>Contacter l'acheteur</Button>
    )
  }

  //SI LA TRANSACTION EST CREATED
  if (transaction.status === 'CREATED') {
    return (
      <div className="flex flex-col h-full  w-full justify-between">
        <Button onClick={onOpen} variant="bordered" className="whitespace-normal" size="sm" color="success">
          Confirmer la vente
        </Button>
        <p
          onClick={cancelHandler}
          className="text-xs text-red-400 text-right font-semibold underline cursor-pointer"
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
  }

  //SI LE STATUS DE LA TRANSACTION EST CANCELED OU DONE
  return (
    <p className="text-xs text-center">
      Cette transaction ne peut plus être modifiée.
    </p>
  )
};

export default SellerInteraction;
