import { ModalBody, Button } from "@nextui-org/react";
import { MoveLeft, MoveRight } from "lucide-react";
import React, { FC, useState } from "react";
import Image from "next/image";

interface IProps {
  imageUrl: string[];
}

const ImageModal: FC<IProps> = ({ imageUrl }) => {


  const [urlIndex, setUrlIndex] = useState(0);
  const maxIndex = imageUrl.length - 1;

  const onIncrementIndex = () => {
    if (urlIndex >= maxIndex) {
      return setUrlIndex(0);
    }
    setUrlIndex(urlIndex + 1);
  };

  const onDecrementIndex = () => {
    if (urlIndex <= 0) {
      return setUrlIndex(maxIndex);
    }
    setUrlIndex(urlIndex - 1);
  };

  return (
    <>
      <ModalBody className="flex flex-row items-center justify-center gap-52 w-full">
        <div className=" flex items-center gap-3">
          <Button isIconOnly variant="bordered" onClick={onDecrementIndex}>
            <MoveLeft size={17} />
          </Button>
          <Image
            src={imageUrl[urlIndex]}
            key={Math.random()}
            alt="picture"
            width={600}
            height={600}
          />
          <Button isIconOnly variant="bordered" onClick={onIncrementIndex}>
            <MoveRight size={17} />
          </Button>
        </div>
        <div className=" lg:grid grid-cols-3 gap-2 hidden">
          {imageUrl.map((url, index) => (
            <Image
              onClick={() => setUrlIndex(index)}
              src={url}
              key={index}
              alt="mini"
              width={100}
              height={100}
              className={`rounded-lg ${
                urlIndex === index && "border-black border-2"
              } cursor-pointer`}
            />
          ))}
        </div>
      </ModalBody>
    </>
  );
};

export default ImageModal;
