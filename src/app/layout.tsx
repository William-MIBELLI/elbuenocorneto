import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Link from "next/link";
import Categories from "@/components/navbar/Categories";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "El bueno Corneto",
  description: "Le cousin mexicain du bon coin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <body className={`${inter.className} bg-white`}>
          <Navbar />
          <Categories/>
          <main className="bg-white m-auto px-2 text-center max-w-screen-lg  mt-4 flex justify-center items-center">
            {children}
          </main>
          <div className="w-full h-96 mt-24 bg-gray-400 flex flex-col justify-center items-center">
            <h3 className="text-2xl font-semibold">
              ⚠️ SITE EN COURS DE DEVELOPPEMENT ⚠️
            </h3>
            <p>Certaines fonctionnalités du site ne sont pas encore disponible</p>
            <p>La base de donnée a été seed de facon aleatoire <span className="text-xs">(mais oui, ici on aimes les chats 👀)</span></p>
          </div>
        </body>
      </SessionProvider>
    </html>
  );
}
