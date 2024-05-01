import { Button } from "@nextui-org/react";
import { Heart, Share2 } from "lucide-react";
import Image from "next/image";
import React, { FC } from "react";

interface IProps {
  imageUrl: string[];
}
const ImageContainer: FC<IProps> = ({ imageUrl }) => {
  const regularDisplay = "relative w-auto mx-auto flex justify-center gap-2";

  const imagesToDisplay = imageUrl.slice(0, 3);

  const isRegular = imagesToDisplay.length < 3;
  // console.log('IMAGE TO DISPLAY.LENGTH ', imagesToDisplay.length, isRegular);
  return (
    <div
      className={`relative w-full ${
        isRegular ? "flex" : "grid grid-cols-4"
      }   gap-1 min-h-96`}
    >
      {isRegular ? (
        imagesToDisplay?.map((image) => (
          <div className="w-full">
            <Image
              className="h-full w-full rounded-lg "
              key={Math.random()}
              src={image}
              alt="product picture"
              width={300}
              height={200}
            />
          </div>
        ))
      ) : (
        <>
          <div className="col-span-2 h-96 relative">
            <Image
              className="h-96 w-full rounded-lg "
              key={Math.random()}
              src={imagesToDisplay[0]}
              alt="product picture"
                fill
            />
          </div>
          <div className="col-start-3 col-span-2 gap-1 p-1 h-96  flex flex-col">
            <Image
              className="h-1/2 w-full rounded-lg"
              key={Math.random()}
              src={imagesToDisplay[1]}
              alt="product picture"
              width={200}
              height={200}
            />
            <Image
              className="h-1/2 w-full rounded-lg"
              key={Math.random()}
              src={imagesToDisplay[2]}
              alt="product picture"
              width={200}
              height={200}
            />
          </div>
        </>
        // <div className="bg-green-300">Pas regular 😢</div>
      )}
      <div className="absolute flex gap-2 right-0 mr-4 mt-3">
        <Button isIconOnly>
          <Share2 size={15} />
        </Button>
        <Button isIconOnly>
          <Heart size={15} />
        </Button>
      </div>
      <Button
        className="absolute font-semibold text-sm bottom-0 right-0 mr-4 mb-3"
        size="sm"
        radius="full"
      >
        Voir les {imageUrl.length} photos
      </Button>
    </div>
  );
};

export default ImageContainer;
