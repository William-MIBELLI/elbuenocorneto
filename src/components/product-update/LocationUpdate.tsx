import React, { useEffect, useState } from "react";
import AddressInput from "../inputs/AddressInput";
import { LocationInsert } from "@/drizzle/schema";
import SubmitButton from "../submit-button/SubmitButton";
import { useFormState } from "react-dom";
import { CheckCircle, MapPin } from "lucide-react";
import { updateLocation } from "@/lib/actions/location.action";
import { useNewProductContext } from "@/context/newproduct.context";

const LocationUpdate = () => {
  const [newLoc, setNewLoc] = useState<LocationInsert>();
  const [success, setSuccess] = useState<boolean>(false);
  const { product, setLocation, location } = useNewProductContext();

  //ONCLICK SUR LA LISTE DES ADRESSE DISPO, ON MET SUCCESS A FALSE ET ON STOCKE LADRESSE SELECTIONNE DANS LE STATE
  const onClickHandler = (item: LocationInsert) => {
    setSuccess(false);
    setNewLoc(item);
  };

  //CALL SERVER ACTION
  const [state, action] = useFormState(
    updateLocation.bind(null, { address: newLoc!, id: product.locationId! }),
    {
      success: false,
      address: null,
    }
  );

  //SI LE SUBMIT EST SUCCESS, ON UPDATE LE CONTEXT AVEC LA NOUVELLE LOCATION, ET ON UPDATE LE STATE LOCAL
  useEffect(() => {
    if (state?.success && state?.address) {
      setLocation({ ...state.address});
      setNewLoc(undefined);
      setSuccess(true);
    }
  }, [state]);

  return (
    <form action={action} className="flex flex-col gap-3">

      {/* ON HIDE L'INPUT SI LE SUBMIT EST OK */}
      {
        state?.success ? (
          <div className="font-semibold text-green-500 text-sm text-center flex items-center justify-center gap-2">
            <CheckCircle />
            <p>
            La nouvelle localisation de votre annonce a bien été enregistrée.
            </p>
          </div>
        ): ( 
          <AddressInput onClickHandler={onClickHandler} />
        )
      }

      {/* ON DISPLAY UN APERCU DE LA NOUVELLE ADRESSE CHOISIE */}
      {newLoc && (
        <div>
          <h3 className="text-center my-2 font-semibold underline">
            Nouvelle localisation pour votre annonce :
          </h3>
          <div className="flex gap-2 items-center">
            <MapPin size={17} />
            <p>{newLoc.city}</p>
            <p>{newLoc.postcode}</p>
          </div>
        </div>
      )}
      <SubmitButton
        fullWidth
        disable={!newLoc}
      />
    </form>
  );
};

export default LocationUpdate;
