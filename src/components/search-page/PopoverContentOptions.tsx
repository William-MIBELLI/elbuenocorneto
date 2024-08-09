"use client";
import { ISearchParams, useSearchContext } from "@/context/search.context";
import { LocationInsert } from "@/drizzle/schema";
import { fetchAddressReverse } from "@/lib/actions/location.action";
import { paramsToQuery } from "@/lib/helpers/search.helper";
import {
  Button,
  Divider,
  PopoverContent,
  Slider,
  SliderValue,
} from "@nextui-org/react";
import { CheckIcon, Crosshair, MapPin, X } from "lucide-react";
import React, { FC, useEffect, useState } from "react";
import { set } from "zod";

const kmValue = [1, 5, 10, 20, 30, 50, 100, 200];

interface IProps {
  trigger: HTMLDivElement | null;
}

const PopoverContentOptions: FC<IProps> = ({ trigger }) => {
  const [displaySlider, setDisplaySlider] = useState<boolean>(false);
  const {
    selectedAddress,
    params,
    updateLocation,
    updateParams
  } = useSearchContext();
  const [errorLocation, setErrorLocation] = useState<string | undefined>();
  const [value, setValue] = useState<SliderValue>(
    kmValue.findIndex((e) => e === params.radius || 1) || 0
  );
  const [km, setKm] = useState<number>(
    params.radius || kmValue[(value as number) || 0]
  );


  //CORRESPONDANCE ENTRE LA VALEUR DU SLIDER ET LES KM
  // useEffect(() => {
  //   setKm(kmValue[(value as number) || 0]);
  //   // setParams({...params, radius: kmValue[(value as number) || 0]});
  // }, [value]);

  useEffect(() => {
    setKm(params.radius || kmValue[(value as number) || 0]);
    if (params.radius) {
      setValue(kmValue.findIndex((e) => e === params.radius));
    }
  }, [params.radius]);

  //QUAND L'USER CHANGE LA VALEUR DU SLIDER
  const onSLiderChange = (value: SliderValue) => {
    setValue(value);
    const km = kmValue[(value as number) || 0];
    setKm(km);
  }
  
  //ON MET UN TIMEOUT POUR EVITER DE TROP DE REQUETES
  useEffect(() => {
    const to = setTimeout(() => {
      //ON UPDATE LES PARAMS
      console.log("ON UPDATE LES PARAMS DANS LE SLIDER");
      updateParams({ ...params, radius: km });
    }, 500);
    return () => clearTimeout(to);
  },[value])

  //CLICK SUR "AUTOUR DE MOI"
  const aroundMeClickHandler = async () => {
    //ON RECUPERE LA LOCALISATION DE L'USER VIA LE BROWSER
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        //ON FETCH L'ADRESSE DEPUIS L'API
        const loc = await fetchAddressReverse(
          JSON.parse(JSON.stringify(position.coords))
        );

        //SI PAS DE LOC, ON DISPLAY UNE ERREUR ET ON FAST RETURN
        if (!loc) {
          return setErrorLocation('Impossible de récupérer votre position');
        }
        //ON LA STOCKE DANS SELECTADDRESS
        updateLocation(loc);

        //ON RESET LA SLIDER A ZERO
        setValue(0);
        setKm(1);

        //ON AFFICHE LE SLIDER
        setDisplaySlider(true);
      },
      (error) => {
        setErrorLocation(
          "Vous devez autoriser la localisation dans votre navigateur."
        );
      }
    );
  };

  //CLICK "TOUTE LA FRANCE"
  const onRemoveAroundMe = () => {
    updateLocation(undefined);
    setValue(0);
    setDisplaySlider(false);
    //updateParams({ ...params, lat: undefined, lng: undefined, radius: undefined });

    // //ON CREE UN NOUVEAU PARAMS
    // const newParams: ISearchParams = {
    //   ...params,
    //   lat: aroundMe?.coordonates?.lat,
    //   lng: aroundMe?.coordonates?.lng,
    //   radius: aroundMe?.coordonates?.lng && aroundMe?.coordonates?.lat ? kmValue[value as number] : undefined,
    // };

    // //ON MET A JOUR PARAMS ET SELECTEDADDRESS DANS LE CONTEXT
    // updateFromSearchLocation(aroundMe, newParams);
  };

  //CLICK SUR RECHERCHER
  const onClickHandler = async () => {
    // //ON CREE UN NOUVEAU PARAMS
    // const newParams: ISearchParams = {
    //   ...params,
    //   lat: aroundMe?.coordonates?.lat,
    //   lng: aroundMe?.coordonates?.lng,
    //   radius: aroundMe?.coordonates?.lng && aroundMe?.coordonates?.lat ? kmValue[value as number] : undefined,
    // };

    // //ON MET A JOUR PARAMS ET SELECTEDADDRESS DANS LE CONTEXT
    // updateFromSearchLocation(aroundMe, newParams);

    // //ON CREE LA QUERY SELON LES NOUVEAUX PARAMS
    // const query = new URLSearchParams(paramsToQuery(params));
    
    //     //ON REMPLACE L'URL AVEC
    //     window.history.replaceState({}, "", `/search-result?${query}`);

    //ON CLOSE LA POPOVER
    if (trigger) {
      trigger.click();
    }
  };

  // useEffect(() => {
  //   //ON CREE UN NOUVEAU PARAMS
  //   const newParams: ISearchParams = {
  //     ...params,
  //     locationId: aroundMe?.id,
  //     lat: aroundMe?.coordonates?.lat || 3,
  //     lng: aroundMe?.coordonates?.lng || 3,
  //     radius: aroundMe?.coordonates?.lng && aroundMe?.coordonates?.lat ? kmValue[value as number] : undefined,
  //   };
    
  //   console.log("AROUND ME DANS LE USEEFFECT: ", aroundMe, newParams);
  //   //ON MET A JOUR PARAMS ET SELECTEDADDRESS DANS LE CONTEXT
  //   updateFromSearchLocation(aroundMe, newParams);

  //   // ON CREE LA QUERY SELON LES NOUVEAUX PARAMS
  //   // const query = new URLSearchParams(paramsToQuery(newParams));
  //   // console.log("ON EST DANS SUBMIT : ", newParams);

  //   // ON REMPLACE L'URL AVEC
  //   // window.history.replaceState({}, "", `/search-result?${query}`);

  // }, [aroundMe]);

  return (
    <PopoverContent className="w-full py-4">
      <div className="flex flex-col items-start w-full gap-4">
        <h3 className="text-md font-semibold">Où voulez-vous chercher ?</h3>
        <Divider />

        {/* AROUND ME */}
        <div className="flex flex-col items-start gap-2 w-full">
          {/* SELECTED CITY */}
          {selectedAddress ? (
            <div className="text-xs px-2 py-0.5 bg-blue-100 rounded-lg text-blue-600 relative">
              {selectedAddress.city}
              <div
                className="absolute -right-1 -top-1 bg-blue-600 rounded-full text-blue-100 cursor-pointer"
                onClick={onRemoveAroundMe}
              >
                <X size={12} />
              </div>
            </div>
          ) : (
            <div
              className="flex w-full p-2 items-center gap-2 hover:bg-gray-100 cursor-pointer"
              onClick={aroundMeClickHandler}
            >
              <Crosshair color="lightblue" />
              <p>Autour de moi</p>
            </div>
          )}

          {/* ERROR LOCATION AROUND ME */}
          {
            errorLocation && (
              <div className="error_message">{errorLocation}</div>
            )
          }

          {(displaySlider || selectedAddress) && (
            <div className="w-full ">
              <div className="flex  justify-between text-blue-400 font-semibold">
                <p>Dans un rayon de</p>
                <p>{kmValue[value as number]} Km</p>
              </div>
              <Slider
                size="sm"
                step={1}
                color="primary"
                maxValue={7}
                minValue={0}
                value={value}
                onChange={onSLiderChange}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* EVERYWHERE */}
        <div
          className="flex items-center gap-2 hover:bg-gray-100 cursor-pointer w-full p-2"
          onClick={onRemoveAroundMe}
        >
          <div>
            <MapPin color="lightblue" />
          </div>
          <p>Toute la France</p>
          {!selectedAddress && <CheckIcon color="lightgreen" />}
        </div>
      </div>
      <Divider className="my-3" />

      {/* FOOTER */}
      <div className="flex justify-between w-full">
        <Button onClick={onRemoveAroundMe} className="button_secondary">
          Effacer
        </Button>
        <Button type="button" className="button_main" onClick={onClickHandler}>
          Rechercher
        </Button>
      </div>
    </PopoverContent>
  );
};

export default PopoverContentOptions;
