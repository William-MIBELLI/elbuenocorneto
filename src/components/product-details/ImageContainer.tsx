import Image from "next/image";
import React, { FC } from "react";

interface IProps {
  imageUrl: string[];
}
const ImageContainer: FC<IProps> = ({ imageUrl }) => {
  return (
    <div className=" w-full flex justify-center gap-2">
      {imageUrl?.map((image) => (
        <Image
          className="rounded-lg"
          key={Math.random()}
          src={image}
          alt="product picture"
          width={200}
          height={200}
        />
      ))}
    </div>
  );
};

export default ImageContainer;
