import { useMapEvents } from "react-leaflet";
import { useContext } from "react";
import { MapContext } from "./MapContext";

const MapClickHandler = () => {
    const { radiusMode, setRadiusCenter } = useContext(MapContext);

    useMapEvents({
        click(e) {
            if (!radiusMode) return;

            // Prevent click if it's inside search bar
            const searchBar = (window as any).searchBarRef?.current;
            if (searchBar && searchBar.contains(e.originalEvent.target as Node)) {
                return;
            }

            setRadiusCenter({
                lat: e.latlng.lat,
                lng: e.latlng.lng,
            });
        },
    });

    return null;
};

export default MapClickHandler;