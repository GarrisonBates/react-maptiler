import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import clsx from "clsx";
import {
  createContext,
  MutableRefObject,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type ControlLocation =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

type MapTypes = {
  children?: ReactNode;
  initialize?: boolean;
  className?: string;
  style?: maptilersdk.ReferenceMapStyle;
  language?: maptilersdk.LanguageString;
  apiKey: string;
  center?: maptilersdk.LngLatLike;
  zoom?: number;
  bearing?: number;
  pitch?: number;
  bounds?: maptilersdk.LngLatBoundsLike;
  hash?: boolean;
  terrain?: boolean;
  terrainExaggeration?: number;
  geolocate?: boolean; // @TODO: GeolocationType.POINT | maptilersdk.GeolocationType.COUNTRY
  attributionControl?: false | maptilersdk.AttributionControlOptions;
  navigationControl?: boolean | ControlLocation;
  terrainControl?: boolean | ControlLocation;
  geolocateControl?: boolean | ControlLocation;
  scaleControl?: boolean | ControlLocation;
  fullscreenControl?: boolean | ControlLocation;
  maptilerLogo?: boolean;
  minimap?: boolean | ControlLocation | maptilersdk.MinimapOptionsInput;
  minZoom?: number;
  maxZoom?: number;
  minPitch?: number;
};

type MapContextTypes = {
  map?: MutableRefObject<maptilersdk.Map | null>;
  styleLoaded?: boolean;
};

export const MapContext = createContext<MapContextTypes>({
  map: { current: null },
  styleLoaded: false,
});

/**
 *
 * @param {boolean} initialize - Whether or not to initialize the map. This is useful if a user wants to add a map high up in the component tree (in order to limit the number of map sessions), but doesn't want to initialize the map until it's needed.
 * @returns
 */
export const Map = ({
  children,
  initialize = true,
  className,
  style = maptilersdk.MapStyle.SATELLITE,
  language,
  apiKey,
  center = [139.753, 35.6844],
  zoom = 14,
  bearing = 0,
  pitch = 0,
  bounds,
  hash = false,
  terrain = false,
  terrainExaggeration = 1,
  geolocate = false,
  attributionControl = false,
  navigationControl = true,
  terrainControl = false,
  geolocateControl = true,
  scaleControl = false,
  fullscreenControl = false,
  maptilerLogo = false,
  minimap = false,
  minZoom = 0,
  maxZoom = 22,
  minPitch = 0,
}: MapTypes) => {
  const [styleLoaded, setStyleLoaded] = useState(false);

  /**
   * map stores map object, and mapContainer is a ref to the container that will hold the map:
   */
  const map = useRef<maptilersdk.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);

  /**
   * When initialize is changed to false, remove the map:
   */
  useEffect(() => {
    if (!initialize) {
      map.current?.remove();
      map.current = null;
    }
  }, [initialize]);

  /**
   * Initialize the map if initialize === true and the map hasn't already been created:
   */
  useEffect(() => {
    console.log("map.current: ", map.current);
    if (map.current || !mapContainer.current || !initialize) return;
    const newMap = new maptilersdk.Map({
      apiKey,
      container: mapContainer.current,
      style,
      center,
      zoom,
      language,
      bearing,
      pitch,
      bounds,
      hash,
      terrain,
      terrainExaggeration,
      geolocate,
      attributionControl,
      navigationControl,
      terrainControl,
      geolocateControl,
      scaleControl,
      fullscreenControl,
      maptilerLogo,
      minimap,
      minZoom,
      maxZoom,
      minPitch,
    });

    /**
     * Track style load state so that it can be tracked with the useMap() hook:
     */
    newMap.on("style.load", () => setStyleLoaded(true));

    map.current = newMap;
  }, [
    initialize,
    apiKey,
    style,
    center,
    zoom,
    language,
    bearing,
    pitch,
    bounds,
    hash,
    terrain,
    terrainExaggeration,
    geolocate,
    attributionControl,
    navigationControl,
    terrainControl,
    geolocateControl,
    scaleControl,
    fullscreenControl,
    maptilerLogo,
    minimap,
    minZoom,
    maxZoom,
    minPitch,
  ]);
  return (
    <MapContext.Provider value={{ map, styleLoaded }}>
      {/* Only render children if map is fully initialized and loaded: */}
      {map && styleLoaded && children}
      <div
        className={clsx(className, "map")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
        ref={mapContainer}
      ></div>
    </MapContext.Provider>
  );
};
