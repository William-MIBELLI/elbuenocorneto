import { NavbarBrand } from "@nextui-org/react";
import Link from "next/link";
import Image from "next/image";
import hat from "public/hat.svg";

const Brand = () => {
  return (
    <NavbarBrand
      as={Link}
      href={"/"}
      className="relative flex justify-center flex-grow-0"
    >
      <p className="text-orange-500 font-bold text-xl">ElBuenoCorneto</p>
      <Image
        alt="hat"
        src={hat}
        height={25}
        width={25}
        className="absolute right-[-15px] top-[-5px]"
      />
    </NavbarBrand>
  );
};

export default Brand;
