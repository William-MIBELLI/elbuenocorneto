import { transactionConversationACTION } from "@/lib/actions/conversation.action";
import { createParcel, getParcel } from "@/lib/requests/sendCloud.request";
import { UserTransactionItem } from "@/lib/requests/transaction.request";
import { Button } from "@nextui-org/react";
import { Mail, Phone, PhoneOutgoing } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";

interface IProps {
  transaction: UserTransactionItem;
}

const DeliveryInfo: FC<IProps> = ({ transaction }) => {

  const {
    seller: { phone: sellerPhone },
    user: { phone: buyerPhone },
    sellerId,
  } = transaction;
  const session = useSession();
  const [phone, setPhone] = useState<string>();
  const router = useRouter();

  //RECUPERER LE NUMERO DE TELEPHONE A DISPLAY
  useEffect(() => {
    if (!session?.data?.user?.id) {
      return;
    }
    const ph = session.data.user.id === sellerId ? buyerPhone : sellerPhone;
    if (ph) {
      setPhone(ph);
    }
  }, [transaction, session]);

  const onGoToConversation = async () => {
    const res = await transactionConversationACTION(transaction);
    if (!res) {
      console.log('RES NULL');
    }
    router.push(`/messages/${res}`);
  }

  //PAS DE LIVRAISON, ON DISPLAY UN LIEN POUR MESSAGE L'ACHETEUR
  if (!transaction?.deliveryMethod) {
    return (
      <div className="my-6">
        <p className="text-sm font-semibold text-blue-800">
          Mettez vous d'accord avec {transaction.sellerId === session.data?.user?.id ? "l'acheteur" : "le vendeur"} afin de réaliser la transaction
          en personne
        </p>
        <div className="mt-3 flex items-center justify-center gap-3">
          <Button onClick={onGoToConversation} className="button_secondary" endContent={<Mail size={15} />}>
            Envoyer un message
          </Button>
          {phone && (
            <Button as={Link}
              href={`tel:${phone}`}
              className="button_main"
              endContent={<PhoneOutgoing size={13} />}
            >
              {phone}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-1/3 mx-auto my-6">
      <div className="text-sm text-left">
        <p className="font-semibold my-2 text-medium">
          {transaction.firstname} {transaction.lastname?.toUpperCase()}
        </p>
        <p>{transaction.addressLine}</p>
        <p>
          {transaction.houseNumber} {transaction.streetName}
        </p>
        <p>
          {transaction.postCode} {transaction.city}
        </p>
        <p></p>
      </div>
    </div>
  );
};

export default DeliveryInfo;
