import { CategoriesType } from "@/interfaces/IProducts";
import {
  Banana,
  BriefcaseBusiness,
  Building,
  Car,
  Ellipsis,
  Guitar,
  MonitorSmartphone,
  Shirt,
  Sofa,
  Sun,
  UsersRound,
} from "lucide-react";
import React, { FC } from "react";

interface IProps {
  category: CategoriesType;
  size?: number;
}

const IconCategorySelector: FC<IProps> = ({ category, size = 20 }) => {
  switch (category) {
    case "electronique":
      return <MonitorSmartphone size={size} />;
    case "famille":
      return <UsersRound size={size} />;
    case "immobilier":
      return <Building size={size} />;
    case "jardin":
      return <Sofa size={size} />;
    case "job":
      return <BriefcaseBusiness size={size} />;
    case "mode":
      return <Shirt size={size} />;
    case "loisir":
      return <Guitar size={size} />;
    case "vacance":
      return <Sun size={size} />;
    case "vehicule":
      return <Car size={size} />;
    case "autre":
      return <Ellipsis size={size} />;
    default:
      return <Banana size={size} />;
  }
};

export default IconCategorySelector;
