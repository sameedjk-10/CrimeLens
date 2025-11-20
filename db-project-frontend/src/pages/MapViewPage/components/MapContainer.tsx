// import React, { useContext } from "react";
// import { MapContainer as LeafletMap, TileLayer, Marker, Popup } from "react-leaflet";
// import MarkerClusterGroup from "react-leaflet-markercluster";
// import { MapContext } from "./MapContext";
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

// const MapContainer: React.FC = () => {
//   // const { crimeData } = useContext(MapContext);

//   // const markers: Crime[] =
//   //   crimeData.length > 0
//   //     ? crimeData
//   //     : Array.from({ length: 30 }).map((_, i) => ({
//   //         id: i + 1,
//   //         title: `Crime ${i + 1}`,
//   //         description: "Dummy crime description",
//   //         crimeType: i % 2 === 0 ? "Theft" : "Burglary",
//   //         zoneName: `Zone ${i % 3}`,
//   //         date: "2025-11-19",
//   //         address: `Address ${i + 1}`,
//   //         location: {
//   //           lat: 24.92 + Math.random() * 0.02,
//   //           lng: 67.09 + Math.random() * 0.02,
//   //         },
//   //       }));

//   // Create 90 dummy crimes in 3 far-apart regions
//   const markers: Crime[] = [
//     // --- Cluster A: Clifton (30 crimes) ---
//     ...Array.from({ length: 30 }).map((_, i) => ({
//       id: i + 1,
//       title: `Clifton Crime ${i + 1}`,
//       description: "Crime occurred in Clifton area.",
//       crimeType: i % 2 === 0 ? "Theft" : "Robbery",
//       zoneName: "Clifton",
//       date: "2025-11-20",
//       address: `Clifton Street ${i + 1}`,
//       location: {
//         lat: 24.820 + Math.random() * 0.05,
//         lng: 67.000 + Math.random() * 0.05,
//       },
//     })),

//     // --- Cluster B: Gulshan (30 crimes) ---
//     ...Array.from({ length: 30 }).map((_, i) => ({
//       id: 100 + i + 1,
//       title: `Gulshan Crime ${i + 1}`,
//       description: "Crime occurred in Gulshan town.",
//       crimeType: i % 2 === 0 ? "Burglary" : "Assault",
//       zoneName: "Gulshan",
//       date: "2025-11-20",
//       address: `Gulshan Block ${i + 1}`,
//       location: {
//         lat: 24.900 + Math.random() * 0.02,
//         lng: 67.100 + Math.random() * 0.02,
//       },
//     })),

//     // --- Cluster C: North Karachi (30 crimes) ---
//     ...Array.from({ length: 30 }).map((_, i) => ({
//       id: 200 + i + 1,
//       title: `North Karachi Crime ${i + 1}`,
//       description: "Crime occurred in North Karachi.",
//       crimeType: i % 2 === 0 ? "Vehicle Theft" : "Drug Possession",
//       zoneName: "North Karachi",
//       date: "2025-11-20",
//       address: `North Karachi Sector ${i + 1}`,
//       location: {
//         lat: 25.000 + Math.random() * 0.02,
//         lng: 67.030 + Math.random() * 0.02,
//       },
//     })),
//   ];

//   return (
//     <div className="w-screen h-screen">
//       <LeafletMap
//         center={[24.92, 67.09]}
//         zoom={12}
//         scrollWheelZoom={true}
//         style={{ width: "100%", height: "100%" }}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution="&copy; OpenStreetMap contributors"
//         />

//         <MarkerClusterGroup chunkedLoading>
//           {markers.map((crime) => (
//             <Marker
//               key={crime.id}
//               position={[crime.location.lat, crime.location.lng]}
//               icon={DefaultIcon}
//             >
//               <Popup>
//                 <div className="text-sm">
//                   <h3 className="font-bold">{crime.title}</h3>
//                   <p>{crime.description}</p>
//                   <p><strong>Type:</strong> {crime.crimeType}</p>
//                   <p><strong>Zone:</strong> {crime.zoneName}</p>
//                   <p><strong>Date:</strong> {crime.date}</p>
//                   <p><strong>Address:</strong> {crime.address}</p>
//                 </div>
//               </Popup>
//             </Marker>
//           ))}
//         </MarkerClusterGroup>
//       </LeafletMap>
//     </div>
//   );
// };

// export default MapContainer;


// MapViewPage/components/MapContainer.tsx
import React from "react";
import { MapContainer as LeafletMap, TileLayer } from "react-leaflet";

const MapContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="w-screen h-screen">
      <LeafletMap
        center={[24.920017, 67.061234]}
        zoom={12}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Render markers, clusters, layers */}
        {children}
      </LeafletMap>
    </div>
  );
};

export default MapContainer;
