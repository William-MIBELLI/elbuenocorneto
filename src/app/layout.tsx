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
          <main className="bg-white m-auto text-center max-w-screen-lg  mt-4 flex justify-center items-center">
            {children}
          </main>
          <div className="w-full h-96 mt-24 bg-yellow-200">
            JE SUIS LE FOOTER
          </div>
        </body>
      </SessionProvider>
    </html>
  );
}
