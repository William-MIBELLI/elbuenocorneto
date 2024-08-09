"use server";
import { LocationInsert, LocationSelect } from "@/drizzle/schema";
import {
  IGeometry,
  IMappedResponse,
  IProperties,
} from "@/interfaces/ILocation";
import { v4 as uuidv4 } from "uuid";
import { updateLocationOnDB } from "../requests/location.request";

export const mapLocationForStorage = (
  address: IMappedResponse[]
): LocationInsert[] => {
  const locations: LocationInsert[] = [];
  address.forEach((item) => {
    const { label, street, postcode, city } = item.properties;

    const location: LocationInsert = {
      id: uuidv4(),
      label,
      streetName: street,
      postcode: +postcode,
      city,
      coordonates: item.geometry,
    };

    //ON VERIFIE QUE CE NE SOIT PAS UN DOUBLON
    if (!locations.find(loc => loc.city === location.city && loc.postcode === location.postcode)){
      locations.push(location);
    }
  });
  return locations;
};

export interface IResponse {
  features: {
    type: string;
    geometry: IGeometry;
    properties: IProperties;
    features: any;
  }[];
  [key: string]: any;
}

export const fetchAddressFromAPI = async (keyword: string, city: boolean = false) => {
  try {
    const sanitizedKeys = keyword.replaceAll(" ", "+");
    const res = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${sanitizedKeys}&autocomplete=1${city ? '&filter=locality&limit=20' : ''}`
    );

    if (res.status !== 200) {
      console.log('RES : ', res)
      throw new Error();
    }
    const data: IResponse = await res.json();
    const mappedResponse: IMappedResponse[] = data.features.map((item) => {
      const [lng, lat] = item.geometry.coordinates;
      const temp = { properties: item.properties, geometry: { lng, lat } };
      return temp;
    });

    const locationList = mapLocationForStorage(mappedResponse);

    return locationList;
  } catch (error) {
    console.log("ERROR FETCHING FROM API ADDRESS : ", error);
    return [];
  }
};

export const fetchAddressReverse = async ( location: GeolocationCoordinates) => {
  try {
    const { latitude, longitude } = location;
    console.log('LOCATION : ', location);
    const res = await fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${longitude}&lat=${latitude}`);
    if (res.status !== 200) {
      throw new Error('fetching fail with status : ' + res.status);
    }
    const data: IResponse = await res.json();
    const mappedResponse: IMappedResponse[] = data.features.map((item) => {
      const [lng, lat] = item.geometry.coordinates;
      const temp = { properties: item.properties, geometry: { lng, lat } };
      return temp;
    });

    const locationList =  await mapLocationForStorage(mappedResponse);

    //SI PAS DE RESULTATS, ON RETOURNE LA POSITION DE L'USER
    if (locationList.length === 0) {
      const myPosition: LocationInsert = {
        id: uuidv4(),
        label: "Votre position",
        streetName: "",
        postcode: 0,
        city: "Votre position",
        coordonates: { lat: latitude, lng: longitude },
      };
      return myPosition;
    }
    //SINON ON RETURN LE 1ER RESULTAT
    return locationList[0];
  } catch (error: any) {
    console.log('ERROR REVERSE FETCH ADDRESS : ', error?.message ?? error);
    return undefined
  }
}

export const updateLocation = async (
  data: { address: LocationInsert; id: string },
  initialState: { success?: boolean; address?: LocationSelect | null },
  fd: FormData
) => {
  console.log("DATA : ", data);
  try {
    console.log("LOC DANS ACTION : ", data.address);

    const updatedLoc = await updateLocationOnDB(data.address, data.id);

    if (!updatedLoc) throw new Error("GET NULL FOR UPDATEDLOC IN ACTION");

    return { success: true, address: updatedLoc };
    
  } catch (error) {
    console.log("ERROR UPDATE LOCATION ACTION ", error);
    return { ...initialState, success: false };
  }
};
