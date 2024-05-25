import { Camera, Plus } from "lucide-react";
import React from "react";

const ActiveImage = () => {
  return (
    <div className="flex flex-col items-center justify-center border-1 border-blue-900 p-6 rounded-lg text-center cursor-pointer hover:shadow-md transition-all">
      <div className="relative flex justify-center">
        <Camera size={50} />
        <Plus
          className="bg-white rounded-full absolute -left-1"
          strokeWidth={4}
        />
      </div>
      <p className="font-semibold text-sm">Ajouter des photos</p>
    </div>
  );
};

export default ActiveImage;
