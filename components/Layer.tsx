import { useMap } from "$/hooks/useMap";
import {
  BackgroundLayerSpecification,
  CircleLayerSpecification,
  FillExtrusionLayerSpecification,
  FillLayerSpecification,
  HeatmapLayerSpecification,
  HillshadeLayerSpecification,
  LayerSpecification,
  LineLayerSpecification,
  RasterLayerSpecification,
  SymbolLayerSpecification,
} from "@maptiler/sdk";
import { useEffect } from "react";

export const Layer = (props: LayerSpecification) => {
  const { map } = useMap();

  /**
   * Add layer to map on component mount:
   */
  useEffect(() => {
    switch (props.type) {
      case "fill":
        map?.addLayer(props as FillLayerSpecification);
        break;
      case "line":
        map?.addLayer(props as LineLayerSpecification);
        break;
      case "symbol":
        map?.addLayer(props as SymbolLayerSpecification);
        break;
      case "raster":
        map?.addLayer(props as RasterLayerSpecification);
        break;
      case "circle":
        map?.addLayer(props as CircleLayerSpecification);
        break;
      case "fill-extrusion":
        map?.addLayer(props as FillExtrusionLayerSpecification);
        break;
      case "heatmap":
        map?.addLayer(props as HeatmapLayerSpecification);
        break;
      case "hillshade":
        map?.addLayer(props as HillshadeLayerSpecification);
        break;
      case "background":
        map?.addLayer(props as BackgroundLayerSpecification);
        break;
    }

    /**
     * On component unmount, remove the layer from the map:
     */
    return () => {
      map?.removeLayer(props.id);
    };
  }, []);

  return null;
};
