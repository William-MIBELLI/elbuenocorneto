import { CategorySelect } from "@/drizzle/schema";
import { Divider, Spinner } from "@nextui-org/react";
import { Check, ChevronRight, CircleCheckBig, List } from "lucide-react";
import React, { Dispatch, FC, useEffect, useState } from "react";
import IconCategorySelector from "../icon-category-selector/IconCategorySelector";
import { CategoriesType } from "@/interfaces/IProducts";
import { useSearchContext } from "@/context/search.context";

interface IProps {
  // setDisplayCategories: Dispatch<boolean>;
}

const CategoriesSelect: FC<IProps> = ({  }) => {
  const { params, setParams, categories, setCategories } = useSearchContext();
  // const [categories, setCategories] = useState<CategorySelect[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  //FONCTIONS POUR FETCH LES CATEGORIES
  const fetchCategories = async () => {
    setLoading(true);
    const res = await fetch("/api/fetch/categories");
    if (!res.ok) {
      console.log("ERROR FETCHING CATEGORIES : ");
      return setCategories([]);
    }
    const data: CategorySelect[] = await res.json();
    setCategories(data);
    setLoading(false);
  };

  //AU MONTAGE ON CHECK SI ON A DEJA LES CATEGORIES DANS LE CONTEXT
  useEffect(() => {
    //SI CATEGORIES EST UNDEFINED OU VIDE, ON FETCH
    if (!categories || !categories.length) {
      fetchCategories(); 
    }
  }, []);

  //GESTION DE LA SELECTION DE LA CATEGORY
  const onClickHandler = (cat: CategoriesType | undefined, label: string) => {
    //SI LUSER RECLIQUE SUR LA MEME CATEGORY QUE CELLE DEJA STOCKEE, ON NE FAIT RIEN
    if (cat !== params.categorySelected) {
      setParams({ ...params, categorySelected: {type: cat, label} });
    }
  };

  return (
    <div className=" flex flex-col gap-3">
      {loading ? (
        <div className="m-auto">
          <Spinner />
        </div>
      ) : (
        <div
        className={`flex items-center justify-between hover:bg-orange-100 p-1 ${params.categorySelected?.type === undefined ? 'bg-orange-50' : 'cursor-pointer'}`}
        onClick={() => onClickHandler(undefined, 'Toutes catégories')}
        >
          <div className="flex gap-2 items-center">
            <List size={17} />
            <p className="font-semibold">Toute les catégories</p>
          </div>
          {params.categorySelected?.type === undefined ? (
            <Check color="lightgreen" />
          ) : (
            <ChevronRight color="gray" />
          )}
        </div>
      )}
      {categories &&
        categories.map((cat) => (
          <div
            key={cat.id}
            className={`flex items-center justify-between hover:bg-orange-100 p-1 ${params.categorySelected?.type === cat.type ? 'bg-orange-50' : 'cursor-pointer'}`}
            onClick={() => onClickHandler(cat.type, cat.label)}
          >
            <div className="flex gap-2 items-center">
              <IconCategorySelector category={cat.type} size={17} />
              <p>{cat.label}</p>
            </div>
            {params.categorySelected?.type === cat.type ? (
              <Check color="lightgreen" />
            ) : (
              <ChevronRight color="gray" />
            )}
          </div>
        ))}
    </div>
  );
};

export default CategoriesSelect;
