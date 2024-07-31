"use client";
import { SearchSelect } from "@/drizzle/schema";
import { ISearchItem } from "@/lib/requests/search.request";
import { Button } from "@nextui-org/react";
import { Layers3, Pen, Trash } from "lucide-react";
import React, { FC, useEffect } from "react";
import IconCategorySelector from "../icon-category-selector/IconCategorySelector";
import { getPriceText, paramsToQuery } from "@/lib/helpers/search.helper";
import { useRouter } from "next/navigation";
import { deleteSearchACTION } from "@/lib/actions/search.action";
import { useFormState } from "react-dom";

interface IProps {
  item: ISearchItem;
  deleteOnState: (id: string) => void;
}

const MySearchItem: FC<IProps> = ({ item, deleteOnState }) => {
  const {
    search: { searchParams },
    location,
  } = item;
  const { keyword, categorySelectedType, categorySelectedLabel, radius } = searchParams;
  const priceToDisplay = getPriceText(searchParams);
  const router = useRouter();

  //ON REDIRIGE VERS LA PAGE DE RECHERCHE AVEC LES PARAMS
  const onRedirectClick = () => {
    const query = paramsToQuery({...searchParams, id: item.search.id});
    const USP = new URLSearchParams(query);
    router.push(`/search-result/?${USP}`);
  }

  const [state, action] = useFormState(deleteSearchACTION.bind(null, {id: item.search.id}), {
    success: false,
    error: "",
  });

  //ON SUPPRIME L'ITEM DE LA LISTE POUR REFRESH L'UI
  useEffect(() => {
    if (state.success) {
      deleteOnState(item.search.id);
    }
  }, [state.success]);

  return (

    <div onClick={onRedirectClick} className="border-1 border-gray-300 rounded-lg p-4 flex cursor-pointer hover:shadow-md">

      {/* LEFT SIDE */}
      <div className=" w-2/3 flex flex-col items-start gap-2">
        
        {/* CATEGORIE */}
        <div className="flex gap-1 text-xs items-center bg-gray-200 rounded-lg w-fit px-2 py-0.5 text-gray-900">
          {categorySelectedType ? (
            <>
              <IconCategorySelector size={13} category={categorySelectedType} />
              <p>{categorySelectedLabel}</p>
            </>
          ) : (
            <>
              <Layers3 size={13} />
              <p>Toutes les catégories</p>
            </>
          )}
        </div>

        {/* TITLE AND COUNT*/}
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold">{keyword}</h3>

          <div className="bg-main rounded-xl text-white font-semibold px-2">
            9+
          </div>
        </div>

        {/* PRICE */}
        <p className="text-sm text-black font-semibold">{priceToDisplay}</p>

        {/* LOCATION */}
        <div>
          {
            location ? (
              <p className="text-xs text-gray-500">Autour de {location.city} ({location.postcode}), dans un rayon de {radius}Km.</p>
            ) : (
              <p className="text-xs text-gray-500">Toute la France</p>
            )
          }
        </div>

        {/* DATE */}
        <p className="text-xs text-gray-500">Crée le {new Date(item.search.createdAt!).toLocaleDateString()}</p>

      </div>
        
      {/* RIGHT SIDE */}  
      <div className=" w-1/3 flex gap-3 justify-end">
        <Button
          isDisabled
          startContent={<Pen size={15} />}
          className="font-semibold bg-transparent hover:bg-blue-100 text-blue-900"
        >
          Modifier
        </Button>
        <form action={action}>
          <Button
            type="submit"
            startContent={<Trash size={15} />}
            className="font-semibold bg-transparent hover:bg-red-100 text-red-500"
          >
            Supprimer
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MySearchItem;
