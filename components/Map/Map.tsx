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
  // @TODO: Add options here from maxPitch to bearingSnap
  pitchWithRotate?: boolean;
};

type MapContextTypes = {
  map: MutableRefObject<maptilersdk.Map | null>;
  styleLoaded: boolean;
  loaded: boolean;
  initializeMap: () => void;
};

export const MapContext = createContext<MapContextTypes | undefined>(undefined);

/**
 *
 * @param {boolean} initialize - Whether or not to initialize the map. This is useful if a user wants to add a map high up in the component tree (in order to limit the number of map sessions), but doesn't want to initialize the map until it's needed.
 * @returns
 */
export const Map = ({
  children,
  initialize: initializeProp = true,
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
  // @TODO: Add options here from maxPitch to bearingSnap
  pitchWithRotate = true,
}: MapTypes) => {
  /**
   * Used to track initialization state. If the initialize prop is set to false, the map won't be initialized until initializeMap() is called:
   */
  const [initialize, setInitialize] = useState(initializeProp);

  const initializeMap = () => {
    if (map.current) return;
    setInitialize(true);
  };
  /**
   * Used to track map load states (e.g. "load" or "style.load")
   */
  const [styleLoaded, setStyleLoaded] = useState(false);
  const [loaded, setLoaded] = useState(false);

  /**
   * map stores map object, and mapContainer is a ref to the container that will hold the map:
   */
  const map = useRef<maptilersdk.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);

  /**
   * Initialize the map if initialize === true and the map hasn't already been created:
   */
  useEffect(() => {
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
      // @TODO: Add options here from maxPitch to bearingSnap
      pitchWithRotate,
    });

    /**
     * Track map load states so that they can be tracked with the useMap() hook:
     */
    newMap.once("style.load", () => setStyleLoaded(true));
    newMap.once("load", () => setLoaded(true));

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
    // @TODO: Add options here from maxPitch to bearingSnap
    pitchWithRotate,
  ]);
  return (
    <MapContext.Provider value={{ map, styleLoaded, loaded, initializeMap }}>
      {children}
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
