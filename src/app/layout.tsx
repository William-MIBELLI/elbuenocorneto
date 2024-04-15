import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "El bueno Corneto",
  description: "Le cousin mexicain du bon coin."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar/>
        <main className="bg-green-500 m-auto text-center max-w-screen-lg h-80">
        {children}
        </main>
      </body>
    </html>
  );
}
