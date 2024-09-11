'use client'
import { Button, Divider, Navbar, NavbarContent } from "@nextui-org/react";
import { useRouter } from "next/router";
import React, { FC } from "react";
import Brand from "./Brand";
import { MoveLeft, ShieldCheck, Tally1 } from "lucide-react";
import Link from "next/link";

interface IProps {
  productId: string;
}

const BuyNavBar: FC<IProps> = ({ productId }) => {

  return <Navbar maxWidth="lg" isBordered className="mb-9">
    <Button as={Link} href={`/product/${productId}`} isIconOnly variant="light" >
      <MoveLeft />
    </Button>
    
    <NavbarContent justify="center" className=" h-auto flex justify-center items-center mx-auto w-fit">
      <Brand />
      <div className="flex items-center gap-1 ml-2 font-semibold text-gray-700">
      <Divider orientation="vertical" className="h-6 w-0.5 mx-2"/>
        <ShieldCheck />
        <p>
          Etape 1/2
        </p>
      </div>
    </NavbarContent>
  </Navbar>;
};

export default BuyNavBar;
