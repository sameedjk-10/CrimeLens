// // MapViewPage/components/MapContext.tsx
// import React, { createContext, useState } from "react";
// import type { ReactNode } from "react";

// // Types for your context
// interface FilterType {
//   crimeType?: string;
//   zone?: string;
//   dateFrom?: string;
//   dateTo?: string;
// }

// interface ToggleLayersType {
//   heatmap: boolean;
//   highlightZones: boolean;
// }

// interface MapContextType {
//   filters: FilterType;
//   setFilters: (filters: FilterType) => void;
//   radiusMode: boolean;
//   setRadiusMode: (mode: boolean) => void;
//   radiusValue: number;
//   setRadiusValue: (value: number) => void;
//   toggleLayers: ToggleLayersType;
//   setToggleLayers: (layers: ToggleLayersType) => void;
//   crimeData: any[];
//   setCrimeData: (data: any[]) => void;
//   zonesData: any[];
//   setZonesData: (data: any[]) => void;
// }

// // Default values
// const defaultContext: MapContextType = {
//   filters: {},
//   setFilters: () => {},
//   radiusMode: false,
//   setRadiusMode: () => {},
//   radiusValue: 500,
//   setRadiusValue: () => {},
//   toggleLayers: { heatmap: false, highlightZones: false },
//   setToggleLayers: () => {},
//   crimeData: [],
//   setCrimeData: () => {},
//   zonesData: [],
//   setZonesData: () => {},
// };

// export const MapContext = createContext<MapContextType>(defaultContext);

// interface Props {
//   children: ReactNode;
// }

// export const MapProvider: React.FC<Props> = ({ children }) => {
//   const [filters, setFilters] = useState<FilterType>({});
//   const [radiusMode, setRadiusMode] = useState<boolean>(false);
//   const [radiusValue, setRadiusValue] = useState<number>(500);
//   const [toggleLayers, setToggleLayers] = useState<ToggleLayersType>({
//     heatmap: false,
//     highlightZones: false,
//   });
//   const [crimeData, setCrimeData] = useState<any[]>([]);
//   const [zonesData, setZonesData] = useState<any[]>([]);

//   return (
//     <MapContext.Provider
//       value={{
//         filters,
//         setFilters,
//         radiusMode,
//         setRadiusMode,
//         radiusValue,
//         setRadiusValue,
//         toggleLayers,
//         setToggleLayers,
//         crimeData,
//         setCrimeData,
//         zonesData,
//         setZonesData,
//       }}
//     >
//       {children}
//     </MapContext.Provider>
//   );
// };

// MapViewPage/components/MapContext.tsx
import React, { createContext, useState } from "react";
import type { Crime } from "./types";

interface MapContextType {
  crimeData: Crime[];
  setCrimeData: React.Dispatch<React.SetStateAction<Crime[]>>;
}

export const MapContext = createContext<MapContextType>({
  crimeData: [],
  setCrimeData: () => {},
});

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [crimeData, setCrimeData] = useState<Crime[]>([]);

  return (
    <MapContext.Provider value={{ crimeData, setCrimeData }}>
      {children}
    </MapContext.Provider>
  );
};
