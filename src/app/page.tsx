import { auth } from "@/auth";
import CardSlider from "@/components/card-slider/CardSlider";
import CategorySlider from "@/components/categories/CategorySlider";
import SellButton from "@/components/sell-button/SellButton";
import { fetchProductsForSlider } from "@/lib/requests/product.request";
import Image from "next/image";


export default async function Home() {
  
  const prods = await fetchProductsForSlider('famille');
  const session = await auth();
  console.log('session dans page : ', session)

  return (
    <div className="flex flex-col w-full gap-12 mt-12">
      <div className="w-full bg-orange-100 rounded-xl py-5 relative overflow-hidden flex flex-col md:flex-row justify-center items-center gap-1 md:gap-4">
        <h1 className="font-semibold text-xl">C'est le moment de vendre</h1>
        <Image
          alt="leftcorner"
          src='/left.svg'
          width={350}
          height={150}
          className="absolute left-0 bottom-0 "
        />
        <Image
          alt="leftcorner"
          src='/right.svg'
          width={110}
          height={120}
          className="absolute bottom-0 -right-1"
        />
        <SellButton/>
      </div>
      <CategorySlider/>
      <CardSlider category="electronique"/>
      <CardSlider category="vacance"/>
      <CardSlider category="immobilier"/> 
    </div>
  );
}
