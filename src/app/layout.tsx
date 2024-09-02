import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Footer from "@/components/footer/Footer";
import { NotificationProvider } from "@/context/notification.context";

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
        <NotificationProvider>
          <body className={`bg-white`}>
            {children}
          </body>
        </NotificationProvider>
      </SessionProvider>
    </html>
  );
}
