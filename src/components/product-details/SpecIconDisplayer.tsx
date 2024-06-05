import { attrNameType } from "@/drizzle/schema";
import {
  BrickWall,
  Cake,
  Calendar,
  Car,
  Columns2,
  Database,
  Fence,
  FileBox,
  Fuel,
  HandCoins,
  MemoryStick,
  Milestone,
  Notebook,
  PenBox,
  Power,
  ReceiptText,
  Ruler,
  Shirt,
  Space,
  WashingMachine,
  Home
} from "lucide-react";
import React, { FC } from "react";

interface IProps {
  name: attrNameType;
}
const SpecIconDisplayer: FC<IProps> = ({ name }) => {
  switch (name) {
    case "year":
      return <Calendar size={17} />;
    case "age":
      return <Cake size={17} />;
    case "brand":
      return <Notebook size={17} />;
    case "carBrand":
      return <Car size={17} />;
    case "clothMaterial":
      return <WashingMachine size={17} />;
    case "color":
      return <Shirt size={17} />;
    case "contractType":
      return <ReceiptText size={17} />;
    case "doors":
      return <Columns2 size={17} />;
    case "fuel":
      return <Fuel size={17} />;
    case "garden":
      return <Fence size={17} />;
    case "habitationType":
      return <Home size={17} />;
    case "livingSpace":
      return <Space size={17} />;
    case "memory":
      return <MemoryStick size={17} />;
    case "milling":
      return <Milestone size={17} />;
    case "model":
      return <FileBox size={17} />;
    case "objectMaterial":
      return <BrickWall size={17} />;
    case "power":
      return <Power size={17} />;
    case "size":
      return <Ruler size={17} />;
    case "stockage":
      return <Database size={17} />;
    case "wage":
      return <HandCoins size={17} />;
    default:
      return <PenBox size={15} />;
  }
};

export default SpecIconDisplayer;
