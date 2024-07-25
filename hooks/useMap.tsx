import { MapContext } from "$/components/Map/Map";
import { useContext } from "react";

export const useMap = () => {
  const context = useContext(MapContext);
  const { map, styleLoaded } = context;

  if (!map) throw new Error("useMap must be called from a child of <Map>");

  /**
   * Initialize the map if it hasn't been yet:
   */
  // useEffect(() => {
  //   console.log("here in useMap");
  //   if (!map) {
  //     if (initializeMap) {
  //       console.log("initialize map");
  //       initializeMap();
  //     } else throw new Error("useMap must be called from a child of <Map>");
  //   }
  // }, []);

  return { map, styleLoaded };
};
