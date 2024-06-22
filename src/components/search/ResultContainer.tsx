import { ProductSelect } from "@/drizzle/schema";
import React, { Dispatch, FC, useEffect, useRef, useState } from "react";
import ResultItem from "./ResultItem";
import { Button, Checkbox, Divider } from "@nextui-org/react";
import { SearchResultType } from "@/interfaces/IProducts";

interface IProps {
  result: SearchResultType[];
  setOpenresult: Dispatch<boolean>;
}

const ResultContainer: FC<IProps> = ({ result, setOpenresult }) => {
  const [open, setOpen] = useState(false);
  const [total, setTotal] = useState(result[0]?.count?.total ?? 0)

  console.log('RESULT : ', result);

  useEffect(() => {
    setTotal(result[0]?.count?.total ?? 0)
  },[result])
  
  return (
    <>
      <div
        className="bg-black fixed top-16 h-dvh inset-x-0 opacity-60 z-40"
        onClick={() => setOpenresult(false)}
      ></div>
      <div
        onBlur={() => console.log("BLUR RESULTACONTAINER")}
        className="flex flex-col w-full pt-3 gap-4 z-50 absolute top-10 p-3  bg-white rounded-xl overflow-hidden"
      >
        <div className="flex items-center justify-end px-2">
          <Checkbox color="warning">
            Recherche uniquement dans le titre
          </Checkbox>
        </div>
        <Divider />
        <div>
          {result[0].count.total === 0 ? (
            <div className="text-center font-semibold my-4">
              Aucun résultat pour cette recherche 😢
            </div>
          ) : result.map((data) => (
            <ResultItem product={data.product!} categoryLabel={data?.category?.label!} key={data?.product?.id!} />
          ))}
        </div>
        {
          total > 3 && (
            <p className="text-sm">
              Et <span className="font-semibold">{total - 3}</span> de plus ...
            </p>
          )
        }
        <Button className="button_main" fullWidth>
          Afficher tous les résultats ({total})
        </Button>
      </div>
    </>
  );
};

export default ResultContainer;
