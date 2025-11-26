// MapViewPage/components/LayerToggle.tsx
import React, { useContext } from "react";
import { MapContext } from "./MapContext";

const LayerToggle: React.FC = () => {
  const { highlightZoneLayer, setHighlightZoneLayer } = useContext(MapContext);

  return (
    <div style={{ position: "absolute", bottom: 20, right: 20, zIndex: 1000 }}>
      <button
        className="p-2 bg-white border rounded shadow"
        onClick={() => setHighlightZoneLayer(prev => !prev)}
      >
        {highlightZoneLayer ? "Hide Zones" : "Highlight Zones"}
      </button>
      {/* Future Heatmap button */}
      {/* <button className="p-2 bg-white border rounded shadow ml-2">Toggle Heatmap</button> */}
    </div>
  );
};

export default LayerToggle;
