import { useSearchContext } from "@/context/search.context";
import {
  Button,
  Divider,
  Checkbox,
  RadioGroup,
  Radio,
  Input,
} from "@nextui-org/react";
import {
  X,
  ChevronRight,
  PackageOpen,
  Euro,
  ArrowDownNarrowWide,
} from "lucide-react";
import React, { Dispatch, FC, useEffect } from "react";

interface IProps {
  setDisplayCategories: Dispatch<boolean>;
}

const MainSelect: FC<IProps> = ({ setDisplayCategories }) => {

  const { params, setParams } = useSearchContext();


  //GESTION DES INPUTS POUR METTRE A JOUR LE CONTEXT
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;
    setParams({...params, [name]: !(name === "donation" || name === 'delivery') ? value: checked})
  };

  useEffect(() => {
    console.log('USEEFFECT SUR LE PARAMS : ', params);
  }, [params]);


  return (
    <>
      {/* CATEGORIES */}
      <div className="section_sider" onClick={() => setDisplayCategories(true)}>
        <h3 className="font-semibold">Catégories</h3>
        <div className="flex justify-between items-center cursor-pointer hover:bg-gray-100 rounded-xl">
          <p className="text-sm">{params.categorySelected?.label ?? 'Toutes catégories'}</p>
          <ChevronRight />
        </div>
      </div>
      <Divider />

      {/* LIVRAISON */}
      <div className="section_sider">
        <div className="flex gap-2 items-center">
          <PackageOpen color="lightblue" />
          <h3 className="font-semibold">Livraison</h3>
        </div>
        <div className="flex justify-between items-center">
          <label className="text-sm" htmlFor="delivery">
            Voir les annonces avec livraison également
          </label>
          <Checkbox
            aria-label="Voir les annonces avec livraison également"
            name="delivery"
            onChange={onChangeHandler}
            isSelected={params.delivery}
          />
        </div>
        <div className="flex gap-1">
          <span className="underline font-semibold text-xs">
            En savoir plus
          </span>
          <p className="text-xs">
            sur le paiement sécurisé et de livraison elbuenocorneto
          </p>
        </div>
      </div>
      <Divider />

      {/* PRICE */}
      <div className="section_sider">
        <div className="flex  gap-2 items-center">
          <Euro color="lightblue" />
          <h3 className="font-semibold">Prix</h3>
        </div>
        <div className="flex justify-between gap-3">
          <Input
            label="Minimum"
            variant="bordered"
            type="number"
            name="min"
            isDisabled={params.donation}
            onChange={onChangeHandler}
            value={params.min?.toString() ?? undefined}
            endContent={
              <div className="flex items-center h-full gap-3">
                <Divider orientation="vertical" />
                <Euro size={15} />
              </div>
            }
          />
          <Input
            label="Maximum"
            type="number"
            variant="bordered"
            name="max"
            isDisabled={params.donation}
            onChange={onChangeHandler}
            value={params.max?.toString() ?? undefined}
            endContent={
              <div className="flex items-center h-full gap-3">
                <Divider orientation="vertical" />
                <Euro size={15} />
              </div>
            }
          />
        </div>
        <div>
          <Checkbox
            name="donation"
            aria-label="Donc uniquement"
            onChange={onChangeHandler}
            isSelected={params.donation}
          />
          <label htmlFor="donation">Dons uniquement</label>
        </div>
      </div>
      <Divider />

      {/* TRI DES RESULTATS */}
      <div className="section_sider">
        <div className="flex gap-2 items-center">
          <ArrowDownNarrowWide color="lightblue" />
          <h3 className="font-semibold">Tri</h3>
        </div>
        <RadioGroup onChange={onChangeHandler} value={params.sort} name="sort">
          <Radio value="date_asc">Plus récentes</Radio>
          <Radio value="date_desc">Plus anciennes</Radio>
          <Radio value="price_asc">Prix croissant</Radio>
          <Radio value="price_desc">Prix décroissant</Radio>
        </RadioGroup>
      </div>
      <Divider />
    </>
  );
};

export default MainSelect;
