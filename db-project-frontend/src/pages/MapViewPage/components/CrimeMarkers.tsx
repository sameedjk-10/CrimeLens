// MapViewPage/components/CrimeMarker.tsx
import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Crime } from "./types";

import markerIcon2x from "../../../assets/leaflet/marker-icon-2x.png";
import markerIcon from "../../../assets/leaflet/marker-icon.png";
import markerShadow from "../../../assets/leaflet/marker-shadow.png";

export const DefaultIcon = new L.Icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const CrimeMarker: React.FC<{ crime: Crime }> = ({ crime }) => {
  return (
    <Marker position={[crime.location.lat, crime.location.lng]} icon={DefaultIcon}>
      <Popup>
        <div className="text-sm">
          <h3 className="font-bold">{crime.title}</h3>
          <p>{crime.description}</p>
          <p><strong>Type:</strong> {crime.crimeType}</p>
          <p><strong>Zone:</strong> {crime.zoneName}</p>
          <p><strong>Date:</strong> {crime.date}</p>
          <p><strong>Address:</strong> {crime.address}</p>
        </div>
      </Popup>
    </Marker>
  );
};

export default CrimeMarker;
