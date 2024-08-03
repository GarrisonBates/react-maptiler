import { MapContext } from "$/components/Map/Map";
import { useContext } from "react";

export const useMap = () => {
  const context = useContext(MapContext);
  const { map, styleLoaded, loaded } = context;

  return { map: map?.current || null, styleLoaded, loaded };
};
