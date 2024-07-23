import { MapContext } from "$/components/Map/Map";
import { useContext } from "react";

export const useMap = () => {
  const { map } = useContext(MapContext);
  if (!map) throw new Error("useMap must be called from a child of <Map>");
  return map;
};
