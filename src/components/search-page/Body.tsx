import React, { Dispatch, FC, useState } from "react";
import MainSelect from "./MainSelect";
import CategoriesSelect from "./CategoriesSelect";
import { useSearchContext } from "@/context/search.context";

interface IProps {
  setIsOpen: Dispatch<boolean>;
}

const Body: FC<IProps> = ({ setIsOpen }) => {
  const { displayCategories, setDisplayCategories } = useSearchContext();

  return !displayCategories ? (
    <MainSelect setDisplayCategories={setDisplayCategories} />
  ) : (
    <CategoriesSelect setDisplayCategories={setDisplayCategories} />
  );
};

export default Body;
