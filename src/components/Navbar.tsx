"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as Nv,
} from "@nextui-org/react";
import {
  Search,
  SquarePlus,
  Bell,
  Heart,
  MessageSquareText,
} from "lucide-react";
import NavItem from "./NavItem";
import Link from "next/link";

const navItems = [
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

  useEffect(() => {
    console.log("ChANGEMENT : ", isOpenMenu);
  }, [isOpenMenu]);
  return (
    <Nv maxWidth="lg" height="4rem" isMenuOpen={isOpenMenu} onMenuOpenChange={setIsOpenMenu}>
      <NavbarContent>
        <NavbarMenuToggle
          className="md:hidden"
          onChange={(isOpen) => setIsOpenMenu(isOpen)}
        />
        <NavbarBrand className=" flex justify-center flex-grow-0">
          <p className="text-orange-500 font-bold text-xl">ElBuenoCorneto</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="start" className="hidden md:flex">
        <Button
          className="min-w-auto box-border bg-orange-500 text-white font-semibold"
          startContent={<SquarePlus size={18} />}
        >
          Déposer une annonce
        </Button>
      </NavbarContent>
      <NavbarContent className="hidden md:flex" justify="center">
        <Input
          placeholder="Rechercher sur El bueno Cornetto"
          endContent={
            <Search className="bg-orange-500 text-white p-1 rounded-lg" />
          }
        />
        {navItems.map((item) => (
          <NavItem
            key={Math.random()}
            Icon={item.Icon}
            target={item.target}
            text={item.text}
          />
        ))}
      </NavbarContent>
      <Button as={Link} href="/auth/login" className="bg-orange-500 text-white">
        Sign in
      </Button>
      <NavbarMenu className="">
        {navItems.map((item) => (
          <NavbarMenuItem key={Math.random()}>
            <Link
              onClick={() => setIsOpenMenu(false)}
              href={item.target}
              className="relative text-sm nav_item pb-1"
            >
              {item.text}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Nv>
  );
};

export default Navbar;
