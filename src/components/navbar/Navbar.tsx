"use client";
import React, { FC, Suspense, useEffect, useRef, useState } from "react";
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
import { pusherClient } from "@/lib/pusher/client";
import { getUnreadMessagesByUserId } from "@/lib/requests/message.request";
import { useNotificationContext } from "@/context/notification.context";

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

interface IProps {
  userId: string | undefined;
}

const Navbar: FC<IProps> = ({ userId }) => {
  const [isSearchFocus, setIsSearchFocus] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const { data, status } = useSession();
  const [user, setUser] = useState(data?.user);
  const { newMessage, setNewMessage } = useNotificationContext();

  useEffect(() => {
    setUser(data?.user);
  }, [data]);

  // //NOTIF POUR LES NOUVEAUX MESSAGES RECUS
  // useEffect(() => {
  //   //SI L'YSER N'EST PAS CONNECTE ON FAST RETURN
  //   if (!userId) {
  //     return
  //   }

  //   console.log('ON RENTRE DANS LE USEEFFECT, userid: ', userId)

  //   //ON SUBSCRIBE AVEC SUR SON ID
  //   pusherClient.subscribe(userId);

  //   //ON BIND SUR new_message
  //   pusherClient.bind('new_message', (msg: any) => {
  //     console.log('ON RECOIT UN NOUVEAU MESSAGE : ', msg);
  //     setNewMessage((previous) => previous + 1);
  //   })

  //   //ON UNSUBSRIBE A LA FERMETURE
  //   return () => {pusherClient.unsubscribe(userId || '') }
  // }, []);

  useEffect(() => {
    console.log("NEWMESSAGE : ", newMessage);
  }, [newMessage]);

  // //ON FETCH LE NOMBRE DE MESSAGES NON LUS
  // useEffect(() => {

  //   if (!user?.id) {
  //     return;
  //   }
  //   console.log('USEEFFECT COUNT NAVBAR');
  //   const getUnreadMsgCount = async () => {
  //     const res = await getUnreadMessagesByUserId(user?.id || '')
  //     console.log('RES DANS NAVBAR : ', res);
  //     if (res) {
  //       setNewMessage(res[0].count)
  //     }
  //   }
  //   getUnreadMsgCount();

  // },[user?.id])

  return (
    <Suspense fallback={<Spinner />}>
      <Nv
        maxWidth="lg"
        position={!isSearchFocus ? "static" : undefined}
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
          <Brand />
        </NavbarContent>

        {/* SEARCH SECTION WITH NEW BUTTON */}

        <SearchInput
          isSearchFocus={isSearchFocus}
          setIsSearchFocus={setIsSearchFocus}
        />

        {/* ITEMS SECTION WITH SIGNIN */}

        <NavbarContent className="hidden md:flex" justify="start">
          {navItems.map((item) => (
            <NavItem
              key={Math.random()}
              Icon={item.Icon}
              target={item.target}
              text={item.text}
              notification={
                item.text === "Messages" && newMessage.length !== 0
                  ? newMessage.length
                  : undefined
              }
            />
          ))}
        </NavbarContent>

        {/* AUTH */}
        {status === "authenticated" ? (
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
          <Spinner color="default" size="sm" />
        )}

        {/* MOBILE MENU */}

        <Menu setIsOpenMenu={setIsOpenMenu} />
      </Nv>
    </Suspense>
  );
};

export default Navbar;
