'use client'
import { Button, Divider, Navbar, NavbarContent } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { FC } from "react";
import Brand from "./Brand";
import { MoveLeft, ShieldCheck, Tally1 } from "lucide-react";
import Link from "next/link";
import { useBuyProductContext } from "@/context/buyProduct.context";

interface IProps {
  productId: string;
}

const BuyNavBar: FC<IProps> = ({ productId }) => {

  const { step, setStep } = useBuyProductContext();
  const router = useRouter();

  //GERER LE CLICK DE RETOUR
  const onBackClickHandler = () => {

    //SI L'USER EST SUR LA PAGE DE PAIEMENT ON LE RAMENE AUX OPTIONS DE LIVRAISONS
    if (step === 'payment') {
      return setStep('delivery');
    }

    //SINON ON LE RAMENE SUR LA PAGE DU PRODUIT
    router.back();
  }

  return <Navbar maxWidth="lg" isBordered className=" mb-9">
    <Button onClick={onBackClickHandler} isIconOnly variant="light" >
      <MoveLeft />
    </Button>
    
    <NavbarContent justify="center" className=" h-auto flex justify-center items-center mx-auto w-fit">
      <Brand />
      <div className="flex items-center gap-1 ml-2 font-semibold text-gray-700">
      <Divider orientation="vertical" className="h-6 w-0.5 mx-2"/>
        <ShieldCheck />
        <p>
          Etape {step === "delivery" ? 1 : 2}/2
        </p>
      </div>
    </NavbarContent>
  </Navbar>;
};

export default BuyNavBar;
