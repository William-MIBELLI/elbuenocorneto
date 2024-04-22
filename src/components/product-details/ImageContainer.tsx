import { Button } from "@nextui-org/react";
import { Heart, Share2 } from "lucide-react";
import Image from "next/image";
import React, { FC } from "react";

interface IProps {
  imageUrl: string[];
}
const ImageContainer: FC<IProps> = ({ imageUrl }) => {

  const regularDisplay = "relative w-auto mx-auto flex justify-center gap-2"

  return (
    <div className="relative w-full grid grid-cols-3 gap-1">
      {imageUrl?.map((image, index) => (
        <Image
          className="rounded-lg mx-auto"
          key={Math.random()}
          src={image}
          alt="product picture"
          width={200}
          height={200}
        />
      ))}
      <div className="absolute flex gap-2 right-0 mr-4 mt-3">
        <Button isIconOnly>
          <Share2 size={15}/>
        </Button>
        <Button isIconOnly>
          <Heart size={15}/>
        </Button>
      </div>
      <Button className="absolute font-semibold text-sm bottom-0 right-0 mr-4 mb-3" size="sm" radius="full" >
        Voir les {imageUrl.length} photos
      </Button>
    </div>
  );
};

export default ImageContainer;
