import { Button } from "@nextui-org/react";
import { SquarePlus } from "lucide-react";
import Link from "next/link";
import React from "react";

const SellButton = () => {
  return (
    <Button
      as={Link}
      href="/deposer-une-annonce"
      className=" bg-orange-500 text-white font-semibold min-w-fit"
      startContent={<SquarePlus size={18} />}
    >
      Déposer une annonce
    </Button>
  );
};

export default SellButton;
