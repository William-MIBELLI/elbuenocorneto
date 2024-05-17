import { uploadImageToCloud } from "@/lib/requests/picture.request";
import { toBase64 } from "@/lib/utils/image.util";
import { Button } from "@nextui-org/react";
import { Camera, FilesIcon, Pencil, Plus } from "lucide-react";
import Image from "next/image";
import React, { Dispatch, FC, useEffect, useRef, useState } from "react";

interface IProps {
  picture: string | undefined;
  setPicture: Dispatch<string | undefined>;
  imageUrl?: string;
}
const AddPicture: FC<IProps> = ({ setPicture, picture, imageUrl }) => {
  console.log('ADDPICTURE : ', picture, imageUrl);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const allowedSize = 1024 * 1024 * 5; //5MO

  const onClickHandler = () => {
    if (inputRef?.current) {
      inputRef.current.click();
    }
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    //ON CHECK QUON A UN FICHIER
    if (!files) return;

    //ON CHECK SA TAILLE
    const file = files[0];
    if (file.size > allowedSize) {
      return setError("Le fichier ne doit pas excéder 5Mo.");
    }

    //ON STOCKE LE FILE DANS LE STATE ET ON REMET ERROR A NULL
    setError(null);

    //ON LENCODE EN BASE64 ET ON LA STOCKE DANS LE STATE
    const fr = new FileReader();
    fr.readAsDataURL(files[0]);
    fr.onload = () => {
      const res = fr.result;
      setPicture(res as string);
    };
    // const res = toBase64(file);
    // console.log('res dans addproducts : ', res);
    // setPicture(res);
  };

  return (
    <div className="flex items-center gap-6 mb-4 max-h-full">
      <div
        onClick={onClickHandler}
        className="p-5  bg-gray-600 cursor-pointer text-white rounded-full w-28 h-28 flex flex-col justify-center items-center text-xs font-semibold relative"
      >
        {imageUrl ? (
          <Image src={imageUrl ?? ''} alt="profile_picture" fill className="rounded-full"/>
        ) : (
          <Camera size={80} />
        )}
        <Button
          onClick={onClickHandler}
          isIconOnly
          className="absolute rounded-full bg-gray-100 -bottom-2 -right-2 shadow-md "
        >
          {
            imageUrl ? (
              <Pencil/>
            ) : (
              <Plus />
            )
          }
        </Button>
        <p>Ajouter une photo</p>
      </div>
      <div className="flex-grow h-28 ">
        {!picture ? (
          <p className="text-sm text-left">
            Avec une photo, vous avez de quoi personnaliser votre profil et
            rassurer les autres membres !
          </p>
        ) : (
            <div className="relative h-28 w-28">
              <Image
                src={picture}
                alt="preview-picture"
                fill
                className="mx-auto rounded-full"
              />
            </div>
        )}
        {error && <p className="error_message">{error}</p>}
      </div>
      <input
        type="file"
        accept="image/*"
        hidden
        ref={inputRef}
        onChange={onChangeHandler}
      />
    </div>
  );
};

export default AddPicture;
