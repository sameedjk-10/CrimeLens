
// // MapViewPage/components/CrimeMarkers.tsx
// import React, { useContext } from "react";
// import { Marker, Popup } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet.markercluster";
// import { MapContext } from "./MapContext";
// // Import required CSS
// import "../../../assets/leaflet/MarkerCluster.css";
// import "../../../assets/leaflet/MarkerCluster.Default.css";

// // Import local marker images
// import markerIcon2x from "../../../assets/leaflet/marker-icon-2x.png";
// import markerIcon from "../../../assets/leaflet/marker-icon.png";
// import markerShadow from "../../../assets/leaflet/marker-shadow.png";

// // Create a custom Leaflet Icon instance
// const DefaultIcon = new L.Icon({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

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

// const CrimeMarkers: React.FC = () => {
//   const { crimeData } = useContext(MapContext);

//   // Use context data if available; otherwise, create dummy points for clustering
//   const markers: Crime[] =
//     crimeData.length > 0
//       ? crimeData
//       : Array.from({ length: 30 }).map((_, i) => ({
//           id: i + 1,
//           title: `Crime ${i + 1}`,
//           description: "Dummy crime description",
//           crimeType: i % 2 === 0 ? "Theft" : "Burglary",
//           zoneName: `Zone ${i % 3}`,
//           date: "2025-11-19",
//           address: `Address ${i + 1}`,
//           // Slightly offset points around central location for clustering
//           location: {
//             lat: 24.9200 + Math.random() * 0.01,
//             lng: 67.0900 + Math.random() * 0.01,
//           },
//         }));

//   return (
//     <>
//       {markers.map((crime) => (
//         <Marker
//           key={crime.id}
//           position={[crime.location.lat, crime.location.lng]}
//           icon={DefaultIcon}
//         >
//           <Popup>
//             <div className="text-sm">
//               <h3 className="font-bold">{crime.title}</h3>
//               <p>{crime.description}</p>
//               <p>
//                 <strong>Type:</strong> {crime.crimeType}
//               </p>
//               <p>
//                 <strong>Zone:</strong> {crime.zoneName}
//               </p>
//               <p>
//                 <strong>Date:</strong> {crime.date}
//               </p>
//               <p>
//                 <strong>Address:</strong> {crime.address}
//               </p>
//             </div>
//           </Popup>
//         </Marker>
//       ))}
//     </>
//   );
// };

// export default CrimeMarkers;


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
