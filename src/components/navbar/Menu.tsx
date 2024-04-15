"use client";
import { NavbarMenu, NavbarMenuItem, Divider } from "@nextui-org/react";
import Link from "next/link";
import React, { FC } from "react";
import { categories } from "./Categories";
import { navItems } from "./Navbar";
import { SquarePlus } from "lucide-react";

interface IProps {
  setIsOpenMenu: (arg: boolean) => void;
}

const Menu: FC<IProps> = ({ setIsOpenMenu }) => {
  return (
    <NavbarMenu>
      <NavbarMenuItem className="flex items-center gap-2">
        <SquarePlus size={17} className="pb-1"/>
        <Link
          onClick={() => setIsOpenMenu(false)}
          href="/deposer-une-annonce"
          className="relative text-sm nav_item pb-1"
        >
          Déposer une annonce
        </Link>
      </NavbarMenuItem>
      <Divider />
      {navItems.map((item) => (
        <NavbarMenuItem key={Math.random()} className="flex items-center gap-2">
          <item.Icon size={17}  className="pb-1"/>
          <Link
            onClick={() => setIsOpenMenu(false)}
            href={item.target}
            className="relative text-sm nav_item pb-1"
          >
            {item.text}
          </Link>
        </NavbarMenuItem>
      ))}
      <Divider />
      {Object.entries(categories).map(([key, value], index) => (
        <NavbarMenuItem key={index}>
          <Link
            onClick={() => setIsOpenMenu(false)}
            href={key}
            className="relative text-sm nav_item pb-1"
          >
            {value}
          </Link>
        </NavbarMenuItem>
      ))}
      <Divider />
    </NavbarMenu>
  );
};

export default Menu;
