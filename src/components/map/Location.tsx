"use client";
import { ICoordonates } from "@/interfaces/IProducts";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { MapPin } from "lucide-react";
import React, { FC, useCallback, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "300px",
};

interface IProps {
  coordonates: ICoordonates;
  API_KEY: string;
}

const Location: FC<IProps> = ({ API_KEY, coordonates }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY,
  });

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
        <h3>Carcassonne</h3>
        <p>(11000)</p>
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
