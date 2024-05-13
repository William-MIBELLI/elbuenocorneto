import { auth } from "@/auth";
import Header from "@/components/my-profile/Header";
import { SelectUser } from "@/drizzle/schema";
import { findUserByEmail } from "@/lib/requests/auth.requests";
import { notFound, redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await auth();

  if (!session) redirect("/auth/login");

  const user: SelectUser | undefined = await findUserByEmail(session.user?.email!);

  if (!user) return notFound();
  return (
    <div className="w-full flex flex-col items-center">
      <Header user={user} />
    </div>
  );
};

export default page;
