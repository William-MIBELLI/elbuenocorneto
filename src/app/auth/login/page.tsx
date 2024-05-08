import LoginForm from "@/components/forms/Login";
import { getSession,  } from "next-auth/react";
import Link from "next/link";
import React from "react";

const Login = async () => {


  return (
    <div className="text-left my-5  px-6 py-9 rounded-xl bg-white shadow-lg w-1/2">
      <h2 className="font-semibold text-2xl">Bonjour !</h2>
      <p className="text-sm">
        Connectez-vous pour découvrir toutes nos fonctionnalités.
      </p>
      <LoginForm />
      <div className="flex justify-center items-center mt-5">
        <p className="text-sm">
          Envie de nous rejoindre ?{" "}
          <Link href={"/auth/signup"} className="font-semibold underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
