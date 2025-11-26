// MapViewPage/components/MapContainer.tsx
import React from "react";
import { MapContainer as LeafletMap, TileLayer } from "react-leaflet";
import MapClickHandler from "./MapClickHandler";
import RadiusVisual from "./RadiusVisual";
import ZonePolygon from "./ZonePolygons";
import LayerToggle from "./LayerToggle";

interface MapContainerProps {
  children: React.ReactNode;
  embedded?: boolean;
}

const MapContainer: React.FC<MapContainerProps> = ({children, embedded = false }: MapContainerProps) => {
  return (
    <div className={embedded ? "w-full h-full" : "w-screen h-screen"}>
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
        <MapClickHandler />     {/* listens for clicks */}
        <RadiusVisual />        {/* shows marker + circle */}
        <ZonePolygon />
        <LayerToggle />
        {/* Render markers, clusters, layers */}
        {children}
      </LeafletMap>
    </div>
  );
};

export default MapContainer;

