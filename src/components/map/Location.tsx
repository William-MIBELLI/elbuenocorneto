"use client";
import { LocationSelect } from "@/drizzle/schema";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import React, { FC, useCallback, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "300px",
};

interface IProps {
  API_KEY: string;
  location: Required<Pick<LocationSelect, 'coordonates' | 'city' | 'postal'>>  | null
}

const Location: FC<IProps> = ({ API_KEY , location }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY,
  });

  if(!location || !location.coordonates) return notFound()

  const { coordonates, city, postal } = location;

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(async (map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds(coordonates);
    //const { } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary
    //map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback((map: google.maps.Map) => {
    setMap(null);
  }, []);

  return (
    <section>
      <div className="flex gap-2 items-center section_title mb-4">
        <MapPin size={18} />
        <h3>{city}</h3>
        <p>({postal})</p>
      </div>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={coordonates}
          zoom={10}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          <Marker position={coordonates} clickable={false}  />
        </GoogleMap>
      )}
    </section>
  );
};

export default Location;
