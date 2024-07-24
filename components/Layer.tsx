import { useSourceId } from "$/components/Source";
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
  const sourceId = useSourceId();

  /**
   * Add layer to map on component mount:
   */
  useEffect(() => {
    switch (props.type) {
      case "fill":
        map?.addLayer({
          ...(props as FillLayerSpecification),
          source: sourceId,
        });
        break;
      case "line":
        map?.addLayer({
          ...(props as LineLayerSpecification),
          source: sourceId,
        });
        break;
      case "symbol":
        map?.addLayer({
          ...(props as SymbolLayerSpecification),
          source: sourceId,
        });
        break;
      case "raster":
        map?.addLayer({
          ...(props as RasterLayerSpecification),
          source: sourceId,
        });
        break;
      case "circle":
        map?.addLayer({
          ...(props as CircleLayerSpecification),
          source: sourceId,
        });
        break;
      case "fill-extrusion":
        map?.addLayer({
          ...(props as FillExtrusionLayerSpecification),
          source: sourceId,
        });
        break;
      case "heatmap":
        map?.addLayer({
          ...(props as HeatmapLayerSpecification),
          source: sourceId,
        });
        break;
      case "hillshade":
        map?.addLayer({
          ...(props as HillshadeLayerSpecification),
          source: sourceId,
        });
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
