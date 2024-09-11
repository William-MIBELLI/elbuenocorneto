import BuyFooter from "@/components/footer/BuyFooter";
import Footer from "@/components/footer/Footer";
import BuyNavBar from "@/components/navbar/BuyNavBar";
import CreationNavbar from "@/components/navbar/CreationNavbar";
import { BuyProductProvider } from "@/context/buyProduct.context";
import { FC } from "react";


export default function BuyLayout({
  children, params 
}: {
    children: React.ReactNode;
    params: {
      productId: string;
  }
  }) {

  return (
    <>
      <BuyProductProvider>
        <BuyNavBar productId={params.productId} />
        <main className=" m-auto px-2 text-center max-w-screen-lg flex justify-center items-center">
          {children}
        </main>
        <BuyFooter/>
      </BuyProductProvider>
    </>
  );
}