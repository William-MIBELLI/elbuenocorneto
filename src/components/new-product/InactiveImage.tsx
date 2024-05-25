import { Camera, Plus } from "lucide-react";
import React from "react";

const InactiveImage = ({ index = 1 }: {index?: number}) => {
  return (
    <div className="flex flex-col items-center justify-center border-dashed border-2 border-gray-300 text-gray-300 p-6 rounded-lg text-center">
      <div className="relative flex justify-center">
        <Camera size={50} />
      </div>
      <p className="font-semibold text-sm">Photo n° {index}</p>
    </div>
  );
};

export default InactiveImage;
