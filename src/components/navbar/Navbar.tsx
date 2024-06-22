"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Input,
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
import SellButton from "../sell-button/SellButton";
import { useSession } from "next-auth/react";
import Brand from "./Brand";
import { ProductSelect } from "@/drizzle/schema";
import SearchInput from "../search/SearchInput";

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
  const { data, status } = useSession();
  const [user, setUser] = useState(data?.user);

  useEffect(() => {
    setUser(data?.user);
  }, [data]);



  return (
    <Nv
      maxWidth="lg"
      height="5rem"
      isMenuOpen={isOpenMenu}
      onMenuOpenChange={setIsOpenMenu}
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
        <Brand/>
      </NavbarContent>

      {/* SEARCH SECTION WITH NEW BUTTON */}

      <SearchInput/>

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
          className="bg-gray-900 text-white"
        >
          Se connecter
        </Button>
          ) : (
              <Spinner color="default" size="sm"/>
        )
      }

      {/* MOBILE MENU */}

      <Menu setIsOpenMenu={setIsOpenMenu} />
    </Nv>
  );
};

export default Navbar;
