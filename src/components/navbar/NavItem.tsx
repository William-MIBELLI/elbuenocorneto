import { NavbarItem } from "@nextui-org/react";
import { Bell, LucideIcon } from "lucide-react";
import Link from "next/link";
import React, { FC, ReactNode } from "react";

interface IProps {
  Icon: LucideIcon;
  text: string;
  target: string;
  notification?: number;
}
const NavItem: FC<IProps> = ({ Icon, text, target, notification }) => {
  return (
    <NavbarItem
      as={Link}
      href={target}
      className="relative flex flex-col justify-center pb-1 items-center nav_item gap-1"
    >
      <Icon size={18} />
      <p className="text-xs">{text}</p>
      {notification && (
        <div className="absolute animate-bounce rounded-full flex justify-center items-center  -top-2 h-3 w-3 -right-2  text-xs bg-main text-white">
        </div>
      )}
    </NavbarItem>
  );
};

export default NavItem;
