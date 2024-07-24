import { Map } from "@maptiler/sdk";

/**
 * Delete all layers belonging to a specific source. This is called when a source is removed from the map, to ensure that all dependent layers are removed before the source is removed, to avoid an error.
 * @param map
 * @param sourceId
 * @returns
 */
export const removeLayersBySource = (
  map: Map | null | undefined,
  sourceId: string
) => {
  if (!map) return;

  const layers = map.getStyle().layers;
  if (!layers) return;

  layers.forEach((layer: any) => {
    if (layer.source === sourceId) {
      map.removeLayer(layer.id);
    }
  });
};
