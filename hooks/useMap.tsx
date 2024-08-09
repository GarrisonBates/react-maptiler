import { MapContext } from "$/components/Map/Map";
import { useContext } from "react";

export const useMap = () => {
  const context = useContext(MapContext);
  /**
   * Ensure that useMap is only called from a descendant of <Map>:
   */
  if (!context)
    throw new Error("useMap can only be called from a descendant of <Map>");

  const { map, styleLoaded, loaded, initializeMap } = context;

  return { map: map?.current, styleLoaded, loaded, initializeMap };
};
