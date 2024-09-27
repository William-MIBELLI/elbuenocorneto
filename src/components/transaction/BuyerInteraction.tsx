import {
  cancelTransactionACTION,
  confirmReceptionTransactionACTION,
} from "@/lib/actions/transaction.action";
import { UserTransactionItem } from "@/lib/requests/transaction.request";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { Check } from "lucide-react";
import Link from "next/link";
import React, { FC, useRef, useState } from "react";

interface IProps {
  transaction: UserTransactionItem;
  cancelClick: () => void;
}
interface IModalContent {
  title: string;
  content: string[];
  buttonText: string;
  onClickMethod: () => void;
}

const BuyerInteraction: FC<IProps> = ({ transaction, cancelClick }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState<boolean>(false);
  const [mod, setMod] = useState<IModalContent>();

  //CONFIRM DE LA TRANSACTION
  const onConfirm = async () => {
    setLoading(true);
    const res = await confirmReceptionTransactionACTION(transaction.id);
    setLoading(false);
  };

  //CANCEL DE LA TRANSACTION
  const onCancel = async () => {
    setLoading(true);
    const res = await cancelTransactionACTION(transaction.id);
    setLoading(false);
  };

  //GESTION DU CLICK SUR LES BOUTONS, ON DISPLAY LA MODAL AVEC LE CONTENU ADAPTE
  const onClickForModal = (type: "confirm" | "cancel" | "refuse") => {
    setMod(modalContent.current[type]);
    onOpen();
  };

  //CONTENU DES MODALS DISPONIBLE
  const modalContent = useRef<
    Record<"confirm" | "cancel" | "refuse", IModalContent>
  >({
    confirm: {
      title: "Confirmation de la transaction",
      content: [
        "En cliquant sur confirmer, vous déclarez que la transaction s'est bien déroulée",
        "Le produit est conforme à la description.",
        "Une fois confirmée, l'argent sera versée au vendeur et l'annulation ne sera plus possible.",
      ],
      buttonText: "Je confirme la transaction",
      onClickMethod: onConfirm,
    },
    cancel: {
      title: "Annulation de la transaction",
      content: [
        "La vente n'ayant pas encore été validée, vous avez la possibilité de l'annuler sans frais.",
        "Le montant de la transaction ne sera pas prélevé.",
      ],
      buttonText: "Je souhaite annuler la transaction",
      onClickMethod: onCancel,
    },
    refuse: {
      title: "Refus de la transaction",
      content: [
        "Vous pouvez refuser la transaction si celle-ci ne vous convient pas.",
        "Si le produit n'est pas conforme à l'annonce ou si le vendeur tarde trop pour la remise en main propre, le montant de la transaction ne sera pas prélevé.",
        "Ne confirmez jamais une transaction sur laquelle vous avez des doutes.",
      ],
      buttonText: "Je refuse la transaction",
      onClickMethod: onCancel,
    },
  });

  //LE SKELETON DE LA MODAL
  const modal = () => {
    return (
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {mod?.title}
              </ModalHeader>
              <ModalBody className="text-sm">
                {mod?.content?.map((par) => (
                  <p key={Math.random()}>{par}</p>
                ))}
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={mod?.onClickMethod}
                  className="button_main"
                  onPress={onClose}
                >
                  {mod?.buttonText}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  };

  //SPINNER SI LOADING
  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  //SI LA TRANSACTION EST CREATED
  if (transaction.status === "CREATED") {
    return (
      <div className="flex flex-col h-full w-3/4 justify-between">
        <Button
          as={Link}
          href={`/conversation/${transaction.productId}`}
          variant="bordered"
          size="sm"
        >
          Contacter le vendeur
        </Button>
        <p
          onClick={() =>
            onClickForModal(
              transaction.status === "ACCEPTED" ? "refuse" : "cancel"
            )
          }
          className="text-xs text-red-500 font-semibold text-right underline cursor-pointer"
        >
          Annuler la vente
        </p>
        {modal()}
      </div>
    );
  }

  //SI LA TRANSACTION EST ACCEPTED ET REMISE EN MAIN PROPRE
  if (transaction.status === "ACCEPTED" && !transaction.deliveryMethod) {
    return (
      <div className="flex flex-col h-full w-3/4 justify-between">
        <Button
          onClick={() => onClickForModal("confirm")}
          variant="bordered"
          color="success"
          size="sm"
          endContent={<Check size={15} />}
        >
          Confirmer la vente
        </Button>
        <p
          onClick={() =>
            onClickForModal(
              transaction.status === "ACCEPTED" ? "refuse" : "cancel"
            )
          }
          className="text-xs text-red-500 font-semibold text-right underline cursor-pointer"
        >
          Refuser la vente
        </p>
        {modal()}
      </div>
    );
  }

  //TRANSACTION ACCEPTED EN LIVRAISON
  if (transaction.status === "ACCEPTED" && transaction.trackingUrl) {
    return (
      <div className="flex flex-col h-full w-3/4 justify-between">
        <Button
          variant="bordered"
          as={Link}
          href={transaction.trackingUrl}
          target="_blank"
          size="sm"
        >
          Suivre le colis
        </Button>
        <p
          onClick={() => onClickForModal("confirm")}
          className="text-xs text-blue-500 font-semibold text-right underline cursor-pointer"
        >
          Confirmer la réception
        </p>
        {modal()}
      </div>
    );
  }

  //TRANSACTION CANCELED
  if (transaction.status === "CANCELED") {
    return (
      <div className="flex flex-col h-full w-3/4 justify-center items-center">
        <p className="text-xs tetx-center">
          Cette transaction ne peut plus être modifiée
        </p>
      </div>
    );
  }

  //TRANSACTION DONE
  if (transaction.status === "DONE") {
    return (
      <div className="flex flex-col h-full w-3/4 justify-center">
        <Button size="sm" variant="bordered">
          Noter le vendeur
        </Button>
      </div>
    );
  }

  return <p>Oups, petit souci ... 🫠</p>;
};

export default BuyerInteraction;
