import { useSearchContext } from "@/context/search.context";
import { createSearchACTION, revalidatePathAfterSuccess, updateSearchACTION } from "@/lib/actions/search.action";
import {
  Divider,
  Checkbox,
  RadioGroup,
  Radio,
  Input,
  Button,
} from "@nextui-org/react";
import {
  ChevronRight,
  PackageOpen,
  Euro,
  ArrowDownNarrowWide,
  ListTodo,
} from "lucide-react";
import { revalidatePath } from "next/cache";
import React, { FC, useEffect } from "react";
import { useFormState } from "react-dom";

interface IProps {
  // setDisplayCategories: Dispatch<boolean>;
}

const MainSelect: FC<IProps> = ({}) => {
  const { params, updateParams, setDisplayCategories, selectedAddress } =
    useSearchContext();

  //GESTION DES INPUTS POUR METTRE A JOUR LE CONTEXT
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;
    updateParams({
      ...params,
      [name]: !(
        name === "donation" ||
        name === "delivery" ||
        name === "titleOnly"
      )
        ? value
        : checked,
      //ON MET PAGE A 1 A CHAQUE FOIS QU'ON CHANGE UN INPUT
      page: 1,
    });
  };

  const [state, action] = useFormState(
    params.id
      ? updateSearchACTION.bind(null, { search: params, location: selectedAddress })
      : createSearchACTION.bind(null, { params, location: selectedAddress }),
    { success: false, error: "", newParams: undefined }
  );
  // const revalidate = async (path: string) => {
  //   'use server';
  //   //revalidatePath(path);
  // }

  //ON RESET LE CACHE DE LA PAGE MY-SEARCH
  useEffect(() => {
    //console.log("STATE DANS LE USEFFECT: ", state);
    if (state.success && state.newParams) {
      // console.log('ON MET A JOUR LES PARAMS DEPUIS LE STATE : ',params, state.newParams);
      updateParams(state.newParams);
    }
  }, [state]);

  return (
    <>
      {/* TITLE ONLY */}
      <div className="section_sider">
        <div className="flex items-center gap-2">
          <Checkbox
            name="titleOnly"
            isSelected={params.titleOnly ?? false}
            onChange={onChangeHandler}
          />
          <label htmlFor="titleOnly" className="font-semibold">
            Rechercher dans le titre uniquement
          </label>
        </div>
      </div>
      <Divider />

      {/* CATEGORIES */}
      <div className="section_sider" onClick={() => setDisplayCategories(true)}>
        <div className="flex items-center gap-2">
          <ListTodo color="lightblue" />
          <h3 className="font-semibold">Catégories</h3>
        </div>
        <div className="flex justify-between items-center cursor-pointer hover:bg-gray-100 rounded-xl">
          <p className="text-sm">
            {params.categorySelectedLabel ?? "Toutes catégories"}
          </p>
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
            isSelected={params.delivery ?? false}
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
            isDisabled={params?.donation ?? false}
            onChange={onChangeHandler}
            value={params.min?.toString() ?? ""}
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
            isDisabled={params.donation ?? false}
            onChange={onChangeHandler}
            value={params.max?.toString() ?? ""}
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
            isSelected={params.donation ?? false}
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
        <RadioGroup
          onChange={onChangeHandler}
          value={(params.sort as string) ?? [undefined]}
          name="sort"
        >
          <Radio value="createdAt_asc">Plus récentes</Radio>
          <Radio value="createdAt_desc">Plus anciennes</Radio>
          <Radio value="price_asc">Prix croissant</Radio>
          <Radio value="price_desc">Prix décroissant</Radio>
        </RadioGroup>
      </div>
      <Divider />

      {/* SAVE / UPDATE SEARCH */}
      <form action={action} className="w-full flex flex-col gap-3" noValidate>
        <Button type="submit" fullWidth className="button_main">
          { params.id ? "Mettre à jour la recherche" : "Sauvegarder la recherche" }
        </Button>
        {state.success && (
          <p className="text-green-500 text-xs text-center">{params.id ? 'Recherche mise a jour' : 'Recherche sauvegardée' }</p>
        )}
        {
          (state.error && !state.success) && <p className="text-red-500 text-xs text-center">{state.error}</p>
        }
      </form>
    </>
  );
};

export default MainSelect;
