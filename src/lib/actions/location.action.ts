import { LocationInsert } from "@/drizzle/schema";
import { IMappedResponse } from "@/interfaces/ILocation";
import { v4 as uuidv4 } from "uuid";

export const mapLocationForStorage = (address: IMappedResponse): LocationInsert => {

  const { label, street, postcode, city } = address.properties;

  const location: LocationInsert = {
    id: uuidv4(),
    label,
    streetName: street,
    postcode: +postcode,
    city,
    coordonates: address.geometry
  }

  return location;
}