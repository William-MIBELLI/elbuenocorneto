import PhoneInput from "@/components/inputs/PhoneInput";
import UncontrolledInput from "@/components/inputs/UncontrolledInput";
import { Divider, Input } from "@nextui-org/react";
import { Smartphone } from "lucide-react";
import React from "react";

const HomeDelivery = () => {
  return (
    <div className="w-full rounded-lg shadow-small p-5 flex flex-col gap-2 text-left my-4">
      <h2 className="font-semibold text-lg">Adresse de livraison</h2>
      <p className="text-gray-400 font-thin">
        transmise au vendeur pour l'envoi du colis
      </p>
      <div className="grid grid-cols-4 gap-2 gap-y-4 my-2">
        <UncontrolledInput name="firstname" label="Prénom" colSpan={2} />
        <UncontrolledInput name="lastname" label="Nom" colSpan={2} />
        <UncontrolledInput
          name="houseNumber"
          type="number"
          label="Numéro"
          required={false}
          colSpan={1}
        />
        <UncontrolledInput name="street" label="Rue" colSpan={3} />
        <UncontrolledInput
          name="addressLine"
          label="Complément d'adresse"
          required={false}
          colSpan={4}
        />
        <UncontrolledInput
          name="postCode"
          type="number"
          label="Code postal"
          colSpan={2}
        />
        <UncontrolledInput name="city" label="Ville" colSpan={2} />
        <UncontrolledInput
          name="country"
          label="Pays"
          defaultValue="France"
          colSpan={2}
          isDisabled
        />
        <UncontrolledInput
          name="phone"
          required={false}
          type="number"
          label="Téléphone"
          colSpan={2}
          startContent={
            <div className="flex items-center text-xs  h-full py-1">
              <Smartphone size={17} />
              <p>+33</p>
              <Divider orientation="vertical" className="ml-2" />
            </div>
          }
        />
      </div>
    </div>
  );
};

export default HomeDelivery;
