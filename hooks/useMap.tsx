import { MapContext } from "$/components/Map/Map";
import { useContext } from "react";

export const useMap = () => {
  const { map } = useContext(MapContext);
  console.log("context: ", useContext(MapContext));
  console.log("mapContext: ", map);
  return map;
};
