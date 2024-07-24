import {
  CircleLayerSpecification,
  FillExtrusionLayerSpecification,
  FillLayerSpecification,
  HeatmapLayerSpecification,
  HillshadeLayerSpecification,
  LineLayerSpecification,
  RasterLayerSpecification,
  SymbolLayerSpecification,
} from "@maptiler/sdk";

/**
 * Make source prop optional, since any <Layer> that's child of <Source> will use parent source's id as the source:
 */
declare type FillLayerProps = Omit<FillLayerSpecification, "source"> & {
  source?: string;
};

declare type LineLayerProps = Omit<LineLayerSpecification, "source"> & {
  source?: string;
};

declare type SymbolLayerProps = Omit<SymbolLayerSpecification, "source"> & {
  source?: string;
};

declare type CircleLayerProps = Omit<CircleLayerSpecification, "source"> & {
  source?: string;
};

declare type HeatmapLayerProps = Omit<HeatmapLayerSpecification, "source"> & {
  source?: string;
};

declare type FillExtrusionLayerProps = Omit<
  FillExtrusionLayerSpecification,
  "source"
> & {
  source?: string;
};

declare type RasterLayerProps = Omit<RasterLayerSpecification, "source"> & {
  source?: string;
};

declare type HillshadeLayerProps = Omit<
  HillshadeLayerSpecification,
  "source"
> & {
  source?: string;
};
