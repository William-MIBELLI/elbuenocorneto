'use client'
import { FavoriteSelect, ImageSelect, LocationSelect, ProductSelect } from "@/drizzle/schema";
import React, { FC } from "react";
import ProductItem from "./ProductItem";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { ProductDataForList, ProductForList } from "@/interfaces/IProducts";

const orderBy = [
  {value:'PRIX_DESC', description: 'prix decroissant', label:'Prix décroissant' },
  {value:'PRIX_ASC', description: 'prix croissant', label:'Prix Croissant' },
  {value:'DATE', description: 'Date de parution', label:'Date de parution' },
]



interface IProps {
  products: ProductForList[];
}

const ProductList: FC<IProps> = ({ products }) => {

  console.log('--------------------')
  products.forEach(p => console.log(p?.product?.id))

  return <div className="flex flex-col gap-3">
    <div className="flex w-full justify-between items-center my-3">
      <p>
        Nb annonces
      </p>
      <div className="flex gap-4 flex-grow items-center justify-end">
        <Select className="max-w-56" label='Trié par'>
          {
            orderBy.map(item => (
              <SelectItem className="" key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))
          }
        </Select>
        <Button isDisabled className="bg-orange-500 text-white">
          Créer un lot
        </Button> 
      </div>
    </div>
    {
      products.map(product => (
          <ProductItem data={product} key={product.product?.id} />
      ))
    }
  </div>
  
};

export default ProductList;
