import { useMap } from "$/hooks/useMap";
import {
  GeoJSONSourceSpecification,
  ImageSourceSpecification,
  RasterDEMSourceSpecification,
  RasterSourceSpecification,
  VectorSourceSpecification,
  VideoSourceSpecification,
} from "@maptiler/sdk";
import { useEffect } from "react";

type PropTypes = {
  children: React.ReactNode;
  id: string;
} & (
  | GeoJSONSourceSpecification
  | VectorSourceSpecification
  | RasterSourceSpecification
  | RasterDEMSourceSpecification
  | ImageSourceSpecification
  | VideoSourceSpecification
);

export const Source = ({ children, id, type, ...props }: PropTypes) => {
  const map = useMap();

  /**
   * Add the source to the map:
   */
  useEffect(() => {
    switch (type) {
      case "geojson":
        map.addSource(id, props as GeoJSONSourceSpecification);
        break;
      case "vector":
        map.addSource(id, props as VectorSourceSpecification);
        break;
      case "raster":
        map.addSource(id, props as RasterSourceSpecification);
        break;
      case "raster-dem":
        map.addSource(id, props as RasterDEMSourceSpecification);
        break;
      case "image":
        map.addSource(id, props as ImageSourceSpecification);
        break;
      case "video":
        map.addSource(id, props as VideoSourceSpecification);
        break;
    }

    /**
     * When component unmounts, remove the source from the map:
     */
    return () => {
      map.removeSource(id);
    };
  }, []);

  return null;
};
