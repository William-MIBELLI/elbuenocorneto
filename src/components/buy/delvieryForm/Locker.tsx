import PhoneInput from "@/components/inputs/PhoneInput";
import { Input } from "@nextui-org/react";
import React, { useState } from "react";

const Locker = () => {
  const [phoneValue, setPhoneValue] = useState("");
  return (
    <div className="flex flex-col gap-3 my-4 w-full">
      {/* SEARCH LOCKER PART */}
      <div className="flex flex-col gap-3 p-5 shadow-small w-full rounded-lg text-left">
        <h2 className="font-semibold text-lg">
          1. Trouver les points relais autour de :
        </h2>
        <Input variant="bordered" placeholder="Adresse" />
      </div>

      {/* INFORMATIONS PERSONELLES PART */}
      <div className="flex flex-col gap-5 p-5 shadow-small w-full rounded-lg text-left">
        <div>
          <h2 className="text-lg font-semibold">2. Informations personelles</h2>
          <p className="text-gray-400 font-thin">
            Une pièce d'identité vous sera demandée pour récupérer vos colis.
          </p>
        </div>
        <div>
          <label htmlFor="firstname">Prénom *</label>
          <Input variant="bordered" placeholder="Prénom" name="firstname" required />
        </div>
        <div>
          <label htmlFor="lastname">Nom *</label>
          <Input variant="bordered" placeholder="Nom" name="lastname" required />
        </div>
        <div className="flex flex-col gap-1">
          <PhoneInput
            value={phoneValue}
            onChangeHandler={(e) => setPhoneValue(e.target.value)}
            bordered
          />
          <p className="text-xs text-gray-400 font-thin">
            Recevoir un SMS pour l'arrivée de votre colis ou voter code de locker
          </p>
        </div>
      </div>
    </div>
  );
};

export default Locker;
