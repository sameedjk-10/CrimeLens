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

