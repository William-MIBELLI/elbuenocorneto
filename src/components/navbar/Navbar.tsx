"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  NavbarBrand,
  NavbarContent,
  NavbarMenuToggle,
  Navbar as Nv,
  Spinner,
} from "@nextui-org/react";
import {
  Search,
  Bell,
  Heart,
  MessageSquareText,
  UserRound,
} from "lucide-react";
import NavItem from "./NavItem";
import Link from "next/link";
import Menu from "./Menu";
import Image from "next/image";
import hat from "public/hat.svg";
import SellButton from "../sell-button/SellButton";
import { useSession } from "next-auth/react";

export const navItems = [
  {
    Icon: Bell,
    text: "Mes recherches",
    target: "/my-search",
  },
  {
    Icon: Heart,
    text: "Favoris",
    target: "/favoris",
  },
  {
    Icon: MessageSquareText,
    text: "Messages",
    target: "/messages",
  },
];

const Navbar = () => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isSearchFocus, setIsSearchFocus] = useState(false);
  const { data, status } = useSession();
  const [user, setUser] = useState(data?.user);

  useEffect(() => {
    // console.log('USEFFECT : ', data);
    setUser(data?.user);
  }, [data]);
  return (
    <Nv
      maxWidth="lg"
      height="5rem"
      isMenuOpen={isOpenMenu}
      onMenuOpenChange={setIsOpenMenu}
      position="static"
      classNames={{
        wrapper: ["md:px-0", "sm:px-6"],
      }}
    >
      {/* BRAND SECTION */}

      <NavbarContent>
        <NavbarMenuToggle
          className="md:hidden"
          onChange={(isOpen) => setIsOpenMenu(isOpen)}
        />
        <NavbarBrand
          as={Link}
          href={"/"}
          className="relative flex justify-center flex-grow-0"
        >
          <p className="text-orange-500 font-bold text-xl">ElBuenoCorneto</p>
          <Image
            alt="hat"
            src={hat}
            height={25}
            width={25}
            className="absolute right-[-15px] top-[-5px] animate-bounce "
          />
        </NavbarBrand>
      </NavbarContent>

      {/* SEARCH SECTION WITH NEW BUTTON */}

      <div className="hidden md:flex w-[50%] gap-2 justify-between">
        {!isSearchFocus && <SellButton />}
        <Input
          onFocus={() => setIsSearchFocus(true)}
          onBlur={() => setIsSearchFocus(false)}
          fullWidth={isSearchFocus}
          placeholder="Rechercher sur El bueno Cornetto"
          endContent={
            <Search
              size={28}
              className="bg-orange-500 text-white p-1 rounded-lg"
            />
          }
          classNames={{
            inputWrapper: ["bg-gray-200", isSearchFocus ? "w-full" : "w-auto"],
          }}
        />
      </div>

      {/* ITEMS SECTION WITH SIGNIN */}

      <NavbarContent className="hidden md:flex" justify="start">
        {navItems.map((item) => (
          <NavItem
            key={Math.random()}
            Icon={item.Icon}
            target={item.target}
            text={item.text}
          />
        ))}
      </NavbarContent>

      {/* AUTH */}
      {
        status === 'authenticated' ? (
          <NavItem
          Icon={UserRound}
          text={user?.name || "Profile"}
          target="/dashboard"
        />
        ) : status === "unauthenticated" ? (
          <Button
          as={Link}
          href="/auth/login"
          className="bg-orange-500 text-white"
        >
          Se connecter
        </Button>
          ) : (
              <Spinner color="default" size="sm"/>
        )
      }

      {/* {status === "authenticated" ? (
        
      ) : status === "unauthenticated " ? (
        <Button
          as={Link}
          href="/auth/login"
          className="bg-orange-500 text-white"
        >
          Se connecter
        </Button>
      ) : (
        <div>Loading...</div>
      )} */}

      {/* MOBILE MENU */}

      <Menu setIsOpenMenu={setIsOpenMenu} />
    </Nv>
  );
};

export default Navbar;
