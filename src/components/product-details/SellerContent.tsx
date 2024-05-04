import { SelectUser } from "@/drizzle/schema";
import React, { FC } from "react";
import UserHeader from "../user/UserHeader";
import { Button } from "@nextui-org/react";
import { MoveRight, UserRound } from "lucide-react";
import Link from "next/link";

interface IProps {
  user: Partial<SelectUser>;
}
const SellerContent: FC<IProps> = async ({ user }) => {
  const { createdAt } = user;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <UserHeader userData={user} />
        <Button
          variant="bordered"
          className="border-blue-900 border-1 text-blue-900 font-semibold"
        >
          Suivre
        </Button>
      </div>
      <div className="flex items-center gap-1 text-xs my-3 justify-between">
        <div className="flex gap-1 items-center">
          <UserRound size={17} />
          <p>Membre depuis {createdAt?.toLocaleDateString()}</p>
        </div>
        <Link href={`/profile/${user.id}`} className="flex gap-1 font-semibold underline">
          <p>Voir les autres annonces de {user.name}</p>
          <MoveRight size={17} />
        </Link>
      </div>
    </div>
  );
};

export default SellerContent;
