"use client";

import React, { FC, useEffect, useState } from "react";
import AddPicture from "../profil-picture/AddPicture";
import { Button, Divider, Input, Spinner } from "@nextui-org/react";
import { useFormState } from "react-dom";
import { updateUserProfile } from "@/lib/actions/auth.action";
import { signOut, useSession } from "next-auth/react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import SubmitButton from "../submit-button/SubmitButton";
import { IProductImage } from "@/interfaces/IProducts";

interface IProps {
  //user: SelectUser
}
const Header: FC<IProps> = () => {

  const session = useSession();
  if (session.status === "unauthenticated") {
    console.log("session not gound ??? : ", session);
    return notFound();
  }


  const { update, data } = session;
  const [picture, setPicture] = useState<IProductImage>();
  const [username, setUsername] = useState(data?.user?.name!);
  const [fd, setFd] = useState(new FormData());

  const [state, action] = useFormState(
    updateUserProfile.bind(null, {
      id: data?.user?.id!,
      actualImg: data?.user?.image,
      fdFile: fd
    }),
    { username: undefined, done: false, newName: null, newImageUrl: null }
  );

  useEffect(() => {
    const f = new FormData();
    if (!picture) {
      return
    }
    f.append('file', picture.file)
    setFd(f)
  },[picture])

  useEffect(() => {
    if (state.done && state?.newName) {
      update({
        ...data,
        user: {
          ...data?.user,
          name: state?.newName,
          image: state?.newImageUrl,
        },
      });
      redirect("/dashboard");
    }
  }, [state]);

  useEffect(() => {
    if (data?.user?.name) {
      setUsername(data.user.name);
    }
  }, [data]);
  return (
    <div className="flex flex-col gap-3  w-full px-1">
      <h1 className="text-left text-2xl font-bold mb-3">Profil</h1>
      <AddPicture
        picture={picture}
        setPicture={setPicture}
        imageUrl={data?.user?.image!}
      />
      <form className="flex flex-col items-start" action={action}>
        <label htmlFor="username">Nom d'utilisateur *</label>
        <Input
          className="w-72"
          variant="bordered"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {state?.username && (
          <p className="error_message">{state.username.join(", ")}</p>
        )}
        <div className="flex justify-between items-center w-full  mt-3">
          <SubmitButton text="Enregistrer les modifications"/>
          <Link
            className="font-semibold underline text-sm"
            href={`/profile/${data?.user?.id}`}
          >
            Accéder à mon profil public
          </Link>
        </div>
      </form>
      <Divider className="my-4" />
      <div className="flex justify-between items-center">
        <p className="font-semibold">Espace candidat</p>
        <Link
          className="font-semibold underline text-sm"
          href={"/profil-candidat"}
        >
          Accéder à mon profil candidat
        </Link>
      </div>
      <Divider className="my-4" />
      <div className="flex justify-between items-center">
        <p className="font-semibold">Espace locataire</p>
        <Link
          className="font-semibold underline text-sm"
          href={"/profil-locataire"}
        >
          Accéder à mon profil locataire
        </Link>
      </div>
      <Divider className="my-4" />
      <div className="flex justify-between items-center">
        <p className="font-semibold">Espace bailleur</p>
        <Link
          className="font-semibold underline text-sm"
          href={"/profil-bailleur"}
        >
          Accéder à mon profil bailleur
        </Link>
      </div>
      <Divider className="my-4" />
      <form
        className="flex justify-start items-start w-full"
        
      >
        <Button onClick={() => signOut({ redirect: true})} className="button_secondary">
          Me déconnecter
        </Button>
      </form>
    </div>
  );
};

export default Header;
