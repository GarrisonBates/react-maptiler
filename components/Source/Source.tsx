import { removeLayersBySource } from "$/components/Source/sourceUtils";
import { useMap } from "$/hooks/useMap";
import {
  GeoJSONSourceSpecification,
  ImageSourceSpecification,
  RasterDEMSourceSpecification,
  RasterSourceSpecification,
  VectorSourceSpecification,
  VideoSourceSpecification,
} from "@maptiler/sdk";
import { createContext, useContext, useEffect, useState } from "react";

type PropTypes = {
  children?: React.ReactNode;
  id: string;
} & (
  | GeoJSONSourceSpecification
  | VectorSourceSpecification
  | RasterSourceSpecification
  | RasterDEMSourceSpecification
  | ImageSourceSpecification
  | VideoSourceSpecification
);

/**
 * Used to pass the source ID to any child <Layer> components:
 */
const SourceContext = createContext({
  id: "",
});
export const useSourceContext = () => useContext(SourceContext);

export const Source = ({ children, id, ...props }: PropTypes) => {
  const { map } = useMap();
  /**
   * Used to prevent children (i.e. <Layer>) from rendering before the source is added to the map:
   */
  const [isLoaded, setIsLoaded] = useState(false);

  /**
   * Add the source to the map:
   */
  useEffect(() => {
    switch (props.type) {
      case "geojson":
        map?.addSource(id, props as GeoJSONSourceSpecification);
        break;
      case "vector":
        map?.addSource(id, props as VectorSourceSpecification);
        break;
      case "raster":
        map?.addSource(id, props as RasterSourceSpecification);
        break;
      case "raster-dem":
        map?.addSource(id, props as RasterDEMSourceSpecification);
        break;
      case "image":
        map?.addSource(id, props as ImageSourceSpecification);
        break;
      case "video":
        map?.addSource(id, props as VideoSourceSpecification);
        break;
    }

    setIsLoaded(true);

    /**
     * When component unmounts, remove the source from the map:
     */
    return () => {
      /**
       * Remove all dependent layers from the map before removing source:
       */
      removeLayersBySource(map, id);
      map?.removeSource(id);
    };
  }, []);

  return (
    <SourceContext.Provider value={{ id }}>
      {isLoaded && children}
    </SourceContext.Provider>
  );
};
