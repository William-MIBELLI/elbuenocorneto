"use client";
import { ISearchItem } from "@/lib/requests/search.request";
import React, { FC, useEffect, useState } from "react";
import MySearchItem from "./MySearchItem";
import { X } from "lucide-react";

interface IProps {
  searchItems: ISearchItem[];
}

const MySearchList: FC<IProps> = ({ searchItems }) => {
  const [searchs, setSearchs] = useState<ISearchItem[]>(searchItems);
  const [displayAlert, setDisplayAlert] = useState<boolean>(false);

  //ON SUPPRIME L'ITEM DE LA LISTE POUR REFRESH L'UI
  const onDeleteSearch = (id: string) => {
    console.log("DELETE SEARCH DANS LIST: ", id);
    setSearchs(searchs.filter((item) => item.search.id !== id));
    setDisplayAlert(true);
  };

  //ON AFFICHE L'ALERT PENDANT 3 SECONDES
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayAlert(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [displayAlert]);

  return (
    <div className="flex flex-col w-full gap-4 relative  min-h-full">
      {displayAlert && (
        <div className="text-center bg-green-100 text-green-500  w-1/2 py-3  rounded-lg mx-auto sticky top-10 left-[50%] z-50  -translate-x-1/2">
          <div className="h-full w-full relative">
            Votre recherche a été supprimée
            <div onClick={() => setDisplayAlert(false)} className="absolute rounded-full bg-green-600 cursor-pointer -top-4 -right-1">
              <X size={15} className="text-green-200"/>
            </div>
          </div>
        </div>
      )}
      {searchs &&
        searchs.map((item) => {
          return (
            <MySearchItem
              key={item.search.id}
              item={item}
              deleteOnState={onDeleteSearch}
            />
          );
        })}
    </div>
  );
};

export default MySearchList;
