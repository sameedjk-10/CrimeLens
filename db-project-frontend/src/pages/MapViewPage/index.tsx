// MapViewPage/index.tsx
import { useEffect, useContext } from "react";
import MapContainer from "./components/MapContainer";
import CrimeMarkersClusters from "./components/CrimeMarkerCluster";
import { MapProvider, MapContext } from "./components/MapContext";
import type { Crime } from "./components/types";
import SearchBar from "./components/SearchBar"

import "leaflet/dist/leaflet.css";
import "../../assets/leaflet/MarkerCluster.Default.css";
import "../../assets/leaflet/MarkerCluster.css";


const dummyData: Crime[] = Array.from({ length: 60 }).map((_, i) => ({
  id: i + 1,
  title: `Dummy Crime ${i + 1}`,
  description: "Sample dummy description",
  crimeType: i % 2 === 0 ? "Theft" : "Robbery",
  zoneName: `Zone ${i % 4}`,
  date: "2025-11-19",
  address: `Street ${i + 1}`,
  location: {
    lat: 24.90 + Math.random() * 0.08,
    lng: 67.04 + Math.random() * 0.08,
  },
}));

const MapContent = () => {
  const { crimeData, setCrimeData } = useContext(MapContext);

  useEffect(() => {
    // =====================================
    // 🚀 FETCH REAL DATA (enable later)
    // =====================================
    
    // uncomment the below later:

    // fetch("/api/crimes")
    //   .then((res) => res.json())
    //   .then((data: Crime[]) => setCrimeData(data))
    //   .catch((err) => console.error("Error fetching crimes:", err));
    

    // For now — show dummy points
    setCrimeData(dummyData);
  }, []);

  return <CrimeMarkersClusters crimes={crimeData} />;
};

const MapPage = () => {
  return (
    <MapProvider>
      <MapContainer>
        <SearchBar />
        <MapContent />
      </MapContainer>
    </MapProvider>
  );
};

export default MapPage;
