import { auth, signOut } from "@/auth";
import LoginForm from "@/components/forms/Login";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import React, { FC } from "react";

interface IProps {
  params: {
    callbackurl: string;
  
  }
}

const Login: FC<IProps> = async ({ params: { callbackurl = '/' } }) => {

  console.log('SLUG : ', callbackurl);
  const session = await auth();
  
  if (session && session.user) {
    return (
      <div className="flex flex-col gap-4 p-8">
        <h3 className="flex gap-2">Vous êtes déjà identifié en tant que <p className="font-semibold italic">{session.user.name}</p>.</h3>
        <form action={async () => {
          'use server';
          await signOut({ redirectTo: '/'})
        }}>
        <Button className="button_danger" type="submit">Sé déconnecter ?</Button>
        </form>
      </div>
    )
  }

  return (
    <div className="text-left my-5  px-6 py-9 rounded-xl bg-white shadow-lg w-1/2">
      <h2 className="font-semibold text-2xl">Bonjour !</h2>
      <p className="text-sm">
        Connectez-vous pour découvrir toutes nos fonctionnalités.
      </p>
      <LoginForm callbackUrl={callbackurl} />
      <div className="flex justify-center items-center mt-5">
        <p className="text-sm">
          Envie de nous rejoindre ?{" "}
          <Link href={`/auth/signup/${callbackurl}`} className="font-semibold underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
