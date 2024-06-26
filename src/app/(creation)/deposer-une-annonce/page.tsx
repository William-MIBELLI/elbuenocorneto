"use server";
import { auth } from "@/auth";
import AuthRequired from "@/components/auth-required/AuthRequired";
import Container from "@/components/new-product/Container";
import { NewProductProvider } from "@/context/newproduct.context";
import { Progress } from "@nextui-org/react";

const page = async () => {
  const session = await auth();

  if (!session || !session?.user) {
    return <AuthRequired />;
  }
  return (
    <NewProductProvider>
      <div className="w-full flex flex-col gap-3 items-start">
        <Container userId={ session.user.id!} />
      </div>
    </NewProductProvider>
  );
};

export default page;
