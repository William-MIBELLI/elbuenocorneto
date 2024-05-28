import React from "react";
import ActiveImage from "./ActiveImage";
import ImagePreview from "./ImagePreview";
import InactiveImage from "./InactiveImage";
import { useNewProductContext } from "@/context/newproduct.context";

const ImagesDisplayer = ({ inputRef }: { inputRef?: React.RefObject<HTMLInputElement>}) => {
  
  const { pictures } = useNewProductContext();
  return (
    <div
      className="grid grid-cols-4 grid-rows-3 w-full text-blue-900 m-2 gap-4"
      onClick={() => inputRef?.current?.click()}
    >
      <ActiveImage />
      {pictures &&
        pictures.map(({ url }) => <ImagePreview url={url} key={url} />)}
      {Array(10 - pictures.length < 0 ? 0 : 10 - pictures.length)
        .fill(0)
        .map((item, index) => (
          <InactiveImage key={index} index={index + 1 + pictures.length} />
        ))}
    </div>
  );
};

export default ImagesDisplayer;
