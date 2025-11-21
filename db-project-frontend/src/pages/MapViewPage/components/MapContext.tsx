// MapViewPage/components/MapContext.tsx
import React, { createContext, useState } from "react";
import type { Crime } from "./types";

export interface MapFilters {
  crimeType: string;
  zoneId: string;
  dateRange: {
    start: string;
    end: string;
  };
}

interface MapContextType {
  // Filters
  filters: MapFilters;
  setFilters: React.Dispatch<React.SetStateAction<MapFilters>>;

  // Radius Search Controls
  radiusMode: boolean;
  setRadiusMode: React.Dispatch<React.SetStateAction<boolean>>;

  radiusValue: number;
  setRadiusValue: React.Dispatch<React.SetStateAction<number>>;

  // Radius center (click point)
  radiusCenter: { lat: number; lng: number } | null;
  setRadiusCenter: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number } | null>
  >;

  // Crime Data
  crimeData: Crime[];
  setCrimeData: React.Dispatch<React.SetStateAction<Crime[]>>;
}

export const MapContext = createContext<MapContextType>({
  // Default values
  filters: {
    crimeType: "",
    zoneId: "",
    dateRange: { start: "", end: "" },
  },
  setFilters: () => {},

  radiusMode: false,
  setRadiusMode: () => {},

  radiusValue: 500,
  setRadiusValue: () => {},

  radiusCenter: null,
  setRadiusCenter: () => {},

  crimeData: [],
  setCrimeData: () => {},
});

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [filters, setFilters] = useState<MapFilters>({
    crimeType: "",
    zoneId: "",
    dateRange: { start: "", end: "" },
  });

  const [radiusMode, setRadiusMode] = useState<boolean>(false);
  const [radiusValue, setRadiusValue] = useState<number>(500);

  const [radiusCenter, setRadiusCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [crimeData, setCrimeData] = useState<Crime[]>([]);

  return (
    <MapContext.Provider
      value={{
        filters,
        setFilters,
        radiusMode,
        setRadiusMode,
        radiusValue,
        setRadiusValue,
        radiusCenter,
        setRadiusCenter,
        crimeData,
        setCrimeData,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
