import { uploadImageToCloud } from "@/lib/requests/picture.request";
import { Button } from "@nextui-org/react";
import { Camera, FilesIcon, Plus } from "lucide-react";
import Image from "next/image";
import React, { Dispatch, FC, useEffect, useRef, useState } from "react";


interface IProps {
  picture: any;
  setPicture: Dispatch<any>
}
const AddPicture: FC<IProps> = ({ setPicture, picture }) => {
  
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const allowedSize = 1024 * 1024 * 5; //5MO
  
  const onClickHandler = () => {
    if (inputRef?.current) {
      inputRef.current.click();
    }
  }


  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    //ON CHECK QUON A UN FICHIER
    if (!files) return;

    //ON CHECK SA TAILLE
    const file = files[0];
    if (file.size > allowedSize) {
      return setError('Le fichier ne doit pas excéder 5Mo.');
    }

    //ON STOCKE LE FILE DANS LE STATE ET ON REMET ERROR A NULL
    setError(null);
    
    //ON LENCODE EN BASE64 ET ON LA STOCKE DANS LE STATE
    const fr = new FileReader();
    fr.readAsDataURL(files[0]);
    fr.onload = () => {
      const res = fr.result;
      setPicture(res)
    }
 
  }

  return (
    <div className="flex items-center gap-6 mb-4">
      <div
        onClick={onClickHandler}
        className="p-5  bg-gray-600 cursor-pointer text-white rounded-full w-28 h-28 flex flex-col justify-center items-center text-xs font-semibold relative"
      >
        <Camera size={80} />
        <Button
          onClick={onClickHandler}
          isIconOnly
          className="absolute rounded-full bg-gray-100 -bottom-2 -right-2 shadow-md"
        >
          <Plus />
        </Button>
        <p>Ajouter une photo</p>
      </div>
      <div className="flex-grow">
        {
          picture === null ? (
          <p className="text-xs text-left">
            Avec une photo, vous avez de quoi personnaliser votre profil et rassurer
            les autres membres !
          </p>
          ) : (
              <Image src={picture} alt='preview-picture' width={130} height={130} className="mx-auto rounded-lg"/>
          )
        }
        {error && (
          <p className="error_message">
            {error}
          </p>
        )}
      </div>
      <input type="file" accept="image/*" hidden ref={inputRef} onChange={onChangeHandler} />
    </div>
  );
};

export default AddPicture;
