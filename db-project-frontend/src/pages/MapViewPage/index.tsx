// // MapViewPage/index.tsx
// import { useEffect, useContext } from "react";
// import MapContainer from "./components/MapContainer";
// import CrimeMarkersClusters from "./components/CrimeMarkerCluster";
// import { MapProvider, MapContext } from "./components/MapContext";
// import type { Crime } from "./components/types";
// import SearchBar from "./components/SearchBar"

// import "leaflet/dist/leaflet.css";
// import "../../assets/leaflet/MarkerCluster.Default.css";
// import "../../assets/leaflet/MarkerCluster.css";


// const dummyData: Crime[] = Array.from({ length: 60 }).map((_, i) => ({
//   id: i + 1,
//   title: `Dummy Crime ${i + 1}`,
//   description: "Sample dummy description",
//   crimeType: i % 2 === 0 ? "Theft" : "Robbery",
//   zoneName: `Zone ${i % 4}`,
//   date: "2025-11-19",
//   address: `Street ${i + 1}`,
//   location: {
//     lat: 24.90 + Math.random() * 0.08,
//     lng: 67.04 + Math.random() * 0.08,
//   },
// }));

// const MapContent = () => {
//   const { crimeData, setCrimeData } = useContext(MapContext);

//   useEffect(() => {
//     // =====================================
//     // 🚀 FETCH REAL DATA (enable later)
//     // =====================================
    
//     // uncomment the below later:

//     // fetch("/api/crimes")
//     //   .then((res) => res.json())
//     //   .then((data: Crime[]) => setCrimeData(data))
//     //   .catch((err) => console.error("Error fetching crimes:", err));
    

//     // For now — show dummy points
//     setCrimeData(dummyData);
//   }, []);

//   return <CrimeMarkersClusters crimes={crimeData} />;
// };

// const MapPage = () => {
//   return (
//     <MapProvider>
//       <MapContainer>
//         <SearchBar />
//         <MapContent />
//       </MapContainer>
//     </MapProvider>
//   );
// };

// export default MapPage;

// MapViewPage/index.tsx
import React, { useEffect, useContext } from "react";
import MapContainer from "./components/MapContainer";
import CrimeMarkersClusters from "./components/CrimeMarkerCluster";
import { MapProvider, MapContext } from "./components/MapContext";
import type { Crime } from "./components/types";
import SearchBar from "./components/SearchBar"


import "leaflet/dist/leaflet.css";
import "../../assets/leaflet/MarkerCluster.Default.css";
import "../../assets/leaflet/MarkerCluster.css";

/**
 * dummyData fallback used when backend fails or for testing
 */
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

/**
 * MapContent is responsible for:
 * - reading URL on mount and applying to context
 * - fetching crimes when searchVersion increments
 */
const MapContent = () => {
  const {
    filters,
    setFilters,
    radiusMode,
    setRadiusMode,
    radiusValue,
    radiusCenter,
    setRadiusValue,
    setRadiusCenter,
    crimeData,
    setCrimeData,
    searchVersion,
    setSearchVersion,
  } = useContext(MapContext);

  // Parse URL on first load to hydrate context
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Basic filters
    const ct = params.get("crimeType") ?? "All";
    const zid = params.get("zoneId") ?? "All";
    const sd = params.get("startDate") ?? "";
    const ed = params.get("endDate") ?? "";

    setFilters({
      crimeType: ct,
      zoneId: zid,
      dateRange: { start: sd, end: ed },
    });

    // Mode
    const mode = params.get("mode") ?? "basic";
    if (mode === "radius") {
      setRadiusMode(true);

      const lat = params.get("lat");
      const lng = params.get("lng");
      const r = params.get("radius");

      if (lat && lng) {
        setRadiusCenter({ lat: Number(lat), lng: Number(lng) });
      }
      if (r) setRadiusValue(Number(r));
    } else {
      setRadiusMode(false);
    }

    // Trigger an initial search to load relevant data (if URL had params)
    // If URL has query string, trigger a fetch so map reflects URL state.
    if (window.location.search) {
      // increment searchVersion to prompt fetch
      setSearchVersion((v) => v + 1);
    } else {
      // no query: load default (all) dataset
      setSearchVersion((v) => v + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch crimes whenever user triggers a search (searchVersion changes)
  useEffect(() => {
    let mounted = true;

    async function loadCrimes() {
      try {
        // Build query based on current context
        const params = new URLSearchParams();

        if (radiusMode && radiusCenter) {
          // Radius endpoint (or use /api/crimes with radius params)
          params.set("mode", "radius");
          params.set("lat", String(radiusCenter.lat));
          params.set("lng", String(radiusCenter.lng));
          params.set("radius", String(radiusValue));
        } else {
          // Basic filters
          params.set("mode", "basic");
          if (filters.crimeType && filters.crimeType !== "All")
            params.set("crimeType", filters.crimeType);
          if (filters.zoneId && filters.zoneId !== "All")
            params.set("zoneId", filters.zoneId);
          if (filters.dateRange.start) params.set("startDate", filters.dateRange.start);
          if (filters.dateRange.end) params.set("endDate", filters.dateRange.end);
        }

        // Example: GET /api/crimes?crimeType=Theft&zoneId=Zone%201
        const url = `/api/crimes?${params.toString()}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Network response was not ok");

        const data = await res.json();
        if (!mounted) return;

        // If your backend returns geometry, convert to {lat,lng} as needed.
        // Assume backend already returns { location: { lat, lng } }.
        setCrimeData(data);
      } catch (err) {
        // fallback to dummy dataset
        console.error("Failed to fetch crimes, using dummy data:", err);
        if (mounted) setCrimeData(dummyData);
      }
    }

    loadCrimes();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchVersion]);

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
