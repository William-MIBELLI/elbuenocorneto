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

    locations.push(location);
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

export const fetchAddressFromAPI = async (keyword: string) => {
  try {
    const sanitizedKeys = keyword.replaceAll(" ", "+");
    const res = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${sanitizedKeys}&autocomplete=0`
    );

    if (res.status !== 200) {
      throw new Error();
    }
    const data: IResponse = await res.json();
    const mappedResponse: IMappedResponse[] = data.features.map((item) => {
      const [lng, lat] = item.geometry.coordinates;
      const temp = { properties: item.properties, geometry: { lng, lat } };
      return temp;
    });
    ///const locationList =   mappedResponse.map(async (item) => await mapLocationForStorage(item));
    const locationList = mapLocationForStorage(mappedResponse);
    return locationList;
  } catch (error) {
    console.log("ERROR FETCHING FROM API ADDRESS : ", error);
    return [];
  }
};

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
