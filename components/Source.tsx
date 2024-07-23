import { useMap } from "$/hooks/useMap";
import {
  GeoJSONSource,
  ImageSource,
  RasterDEMTileSource,
  RasterTileSource,
  VectorTileSource,
  VideoSource,
} from "@maptiler/sdk";
import { useEffect } from "react";

interface CommonProps {
  children: React.ReactNode;
  id: string;
}

type GeoJSONSourceProps = CommonProps &
  GeoJSONSource & { type: "geojson"; data: GeoJSON.GeoJSON | string };
type VectorTileSourceProps = CommonProps &
  VectorTileSource & { type: "vector" };
type RasterTileSourceProps = CommonProps &
  RasterTileSource & { type: "raster" };
type RasterDEMTileSourceProps = CommonProps &
  RasterDEMTileSource & { type: "raster-dem" };
type ImageSourceProps = CommonProps & ImageSource & { type: "image" };
type VideoSourceProps = CommonProps & VideoSource & { type: "video" };

type PropTypes =
  | GeoJSONSourceProps
  | VectorTileSourceProps
  | RasterTileSourceProps
  | RasterDEMTileSourceProps
  | ImageSourceProps
  | VideoSourceProps;

export const Source = ({ children, id, type, ...props }: PropTypes) => {
  const map = useMap();
  useEffect(() => {
    switch (type) {
      case "geojson":
        map.addSource(id, {
          type,
          data: (props as GeoJSONSourceProps).data,
          ...props,
        });
        break;
      // @TODO: Add other source types
    }
  }, []);

  return null;
};
