// import { useMap } from "react-leaflet";
// import { useEffect } from "react";
// import L from "leaflet";
// import "leaflet.markercluster";
// import "leaflet.markercluster/dist/MarkerCluster.css";
// import "leaflet.markercluster/dist/MarkerCluster.Default.css";
// import { DefaultIcon } from "./DefaultIcon";

// interface Crime {
//   id: number;
//   title: string;
//   description: string;
//   crimeType: string;
//   zoneName: string;
//   date: string;
//   address: string;
//   location: { lat: number; lng: number };
// }

// interface Props {
//   crimes: Crime[];
//   icon?: L.Icon;
// }

// const CrimeMarkerCluster: React.FC<Props> = ({ crimes, icon = DefaultIcon }) => {
//   const map = useMap();

//   useEffect(() => {
//     const markers = L.markerClusterGroup();

//     crimes.forEach((crime) => {
//       const marker = L.marker([crime.location.lat, crime.location.lng], { icon });
//       marker.bindPopup(`
//         <b>${crime.title}</b><br/>
//         ${crime.description}<br/>
//         Type: ${crime.crimeType}<br/>
//         Zone: ${crime.zoneName}<br/>
//         Date: ${crime.date}<br/>
//         Address: ${crime.address}
//       `);
//       markers.addLayer(marker);
//     });

//     map.addLayer(markers);

//     return () => {
//       map.removeLayer(markers);
//     };
//   }, [map, crimes, icon]);

//   return null;
// };

// export default CrimeMarkerCluster;

// MapViewPage/components/CrimeMarkersClusters.tsx
import React from "react";
import MarkerClusterGroup from "react-leaflet-markercluster";
import type { Crime } from "./types";
import CrimeMarker from "./CrimeMarkers";

// CSS (local imported)
// import "../../../assets/leaflet/MarkerCluster.css";
// import "../../../assets/leaflet/MarkerCluster.Default.css";

const CrimeMarkersClusters: React.FC<{ crimes: Crime[] }> = ({ crimes }) => {
  return (
    <MarkerClusterGroup chunkedLoading>
      {crimes.map((crime) => (
        <CrimeMarker key={crime.id} crime={crime} />
      ))}
    </MarkerClusterGroup>
  );
};

export default CrimeMarkersClusters;

