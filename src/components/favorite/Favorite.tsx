"use client";
import { FavoriteSelect, ProductSelect } from "@/drizzle/schema";
import { updateFavoriteACTION } from "@/lib/actions/favorite.action";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { Dispatch, FC, useEffect, useState } from "react";
import { useFormState } from "react-dom";

interface IProps {
  productId: string;
  open: boolean;
  setOpen: Dispatch<boolean>;
  userId?: string;
  size?: number;
  fav: boolean
}
const Favorite: FC<IProps> = ({ productId, open, setOpen, fav, size = 17}) => {

  const [isFavorite, setIsFavorite] = useState<boolean>(fav);
  const session = useSession();

  const[state, action] = useFormState(updateFavoriteACTION, { success: false, value: isFavorite})

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!session.data?.user?.id) {
      console.log('PAS DUSERID, ON PREVENT  DEFAULT');
      e.preventDefault();
      return setOpen(true);
    }
    setIsFavorite(!isFavorite);
    console.log('USERID OK, CALL ACTION');
  };


  return (
    <form action={action} onSubmit={onSubmitHandler} onClick={e => e.stopPropagation()}>
      <input hidden defaultValue={productId} name="productId"/>
      <input hidden defaultValue={session.data?.user?.id} name="userId"/>
      <button type="submit" className="p-1 hover:scale-110">
        <Heart
          size={size}
          className={!isFavorite ? "" : "text-pink-600"}
          strokeWidth={3}
        />
      </button>
    </form>
  );
};

export default Favorite;
