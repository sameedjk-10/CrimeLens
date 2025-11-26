// MapViewPage/components/LayerToggle.tsx
import React, { useContext } from "react";
import { MapContext } from "./MapContext";

const LayerToggle: React.FC = () => {
  const { highlightZoneLayer, setHighlightZoneLayer } = useContext(MapContext);

  return (
    <div style={{ position: "absolute", bottom: 20, right: 20, zIndex: 1000 }}>
      <button
        className="px-6 py-2 font-semibold bg-linear-to-r from-[#145332] to-[#237E54] border-2 border-[#237E54] hover:from-[#145332] hover:to-[#145332] rounded-2xl text-md text-[#FFFFFF] shadow"
        onClick={() => setHighlightZoneLayer(prev => !prev)}
      >
        {highlightZoneLayer ? "Hide Zones" : "Highlight Zones"}
      </button>

    </div>
  );
};

export default LayerToggle;
