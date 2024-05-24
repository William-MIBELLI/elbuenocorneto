"use server";
import { auth } from "@/auth";
import AuthRequired from "@/components/auth-required/AuthRequired";
import Container from "@/components/new-product/Container";
import { NewProductProvider } from "@/context/newproduct.context";

const page = async () => {
  const session = await auth();

  if (!session || !session?.user) {
    return <AuthRequired />;
  }
  return (
    <NewProductProvider>
      <div className="w-full flex flex-col gap-3 items-start ">
        <h1 className="text-2xl font-bold">Commençons par l'essentiel !</h1>
        <p className="text-xs">* Champs obligatoire</p>
        <Container/>
      </div>
    </NewProductProvider>
  );
};

export default page;
