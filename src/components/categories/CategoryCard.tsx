import { ICategory } from "@/interfaces/IProducts";
import { Card, CardFooter, Button } from "@nextui-org/react";
import Image from "next/image";
import React, { FC } from "react";

interface IProps {
  category: ICategory;
}

const CategoryCard: FC<IProps> = ({ category }) => {
  const { imageUrl, label } = category;

  return (
    <Card isFooterBlurred radius="lg" className="border-none min-w-40  bg-blue-300">
      <Image
        alt={label}
        className="object-fit"
        height={240}
        src={`/images/categories/${imageUrl}.png`}
        width={360}
      />
      <p className="absolute bottom-0  left-0 right-0 text-center text-xs py-3  text-white">{label}</p>
    </Card>
  );
};

export default CategoryCard;
