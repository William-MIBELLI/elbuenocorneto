import React, { FC } from "react";
import Image from "next/image";
import { CircleX, X } from "lucide-react";
import { Button } from "@nextui-org/react";
import { useNewProductContext } from "@/context/newproduct.context";

interface IProps {
  url: string;
}

const ImagePreview: FC<IProps> = ({ url }) => {

  const { pictures, setPictures } = useNewProductContext();
  
  const onRemoveHandler = () => {
    
    const newPictures = pictures.filter(item => item.url !== url)
    
    setPictures(newPictures);
  }

  return (
    <div className="relative w-full h-full">
      <Image src={url} alt="pic" fill className="rounded-lg" />
      <Button
        className="absolute text-gray-500 bg-white -top-4 -right-4 rounded-full p-1"
        isIconOnly
        onClick={onRemoveHandler}
      >
        <X size={25} />
      </Button>
    </div>
  );
};

export default ImagePreview;
