
import Footer from "@/components/footer/Footer";
import CreationNavbar from "@/components/navbar/CreationNavbar";
import { useNewProductContext } from "@/context/newproduct.context";
import { Progress } from "@nextui-org/react";
import { useState } from "react";

export default function CreationLayout({
  children,
}: {
  children: React.ReactNode;
  }) {

  return (
    <>
      <CreationNavbar />
      <main className=" m-auto px-2 text-center max-w-screen-lg flex justify-center items-center">
        {children}
      </main>
      <Footer/>
    </>
  );
}
