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
 * @description Initializes and renders a Map component with customizable options,
 * including style, language, center, zoom, and controls. It uses React hooks to
 * manage the map's load state and provide it as a context for child components to access.
 *
 * @param {object} obj - 32 parameters long. It includes optional and default values
 * for various map properties such as style, language, zoom level, location, bounds,
 * controls, and more.
 *
 * @param {MapTypes} obj.children - Used to render child components inside the map.
 *
 * @param {initializeProp = true} obj.initialize - Used to control map initialization.
 *
 * @param {MapTypes} obj.className - Used to set CSS classes for the map container element.
 *
 * @param {maptilersdk.MapStyle.SATELLITE} obj.style - Used to specify map visual styles.
 *
 * @param {MapTypes} obj.language - Used to set the map's language for text overlays.
 *
 * @param {MapTypes} obj.apiKey - Used to authenticate with MapTiler SDK.
 *
 * @param {array} obj.center - Used to set the initial location on the map.
 *
 * @param {number} obj.zoom - Used to control the map's zoom level.
 *
 * @param {number} obj.bearing - Used to set the map's rotation angle.
 *
 * @param {number} obj.pitch - Used to adjust map tilt.
 *
 * @param {MapTypes} obj.bounds - Used to set map boundaries.
 *
 * @param {boolean} obj.hash - Used to enable or disable hash-based navigation on the
 * map.
 *
 * @param {boolean} obj.terrain - Used to enable terrain rendering on the map.
 *
 * @param {number} obj.terrainExaggeration - Used to exaggerate terrain features on
 * the map.
 *
 * @param {boolean} obj.geolocate - Used to enable geolocation on the map.
 *
 * @param {boolean} obj.attributionControl - Used to display map attribution information.
 *
 * @param {boolean} obj.navigationControl - Used to show or hide navigation controls
 * on the map.
 *
 * @param {boolean} obj.terrainControl - Used to display terrain control on the map.
 *
 * @param {boolean} obj.geolocateControl - Used to enable or disable geolocation
 * control on the map.
 *
 * @param {boolean} obj.scaleControl - Used to control whether scale information is
 * visible on the map.
 *
 * @param {boolean} obj.fullscreenControl - Used to enable or disable fullscreen control.
 *
 * @param {boolean} obj.maptilerLogo - Used to display the MapTiler logo on the map.
 *
 * @param {boolean} obj.minimap - Related to displaying a smaller map view within the
 * main map.
 *
 * @param {number} obj.minZoom - Used to set the minimum zoom level of the map.
 *
 * @param {number} obj.maxZoom - Used to limit the maximum zoom level of the map.
 *
 * @param {number} obj.minPitch - Part of map's camera settings, controlling minimum
 * pitch angle.
 *
 * @param {boolean} obj.pitchWithRotate - Used to enable or disable pitch with rotation.
 *
 * @returns {JSX.Element} A provider component that wraps a div element with a reference
 * to the map container and passes the map object, style loaded state, and loaded
 * state as props via the MapContext.Provider.
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

  /**
   * @description Checks if a current map is already defined, and only executes further
   * steps if it's not. It then sets an `initialize` flag to true and logs "INITIALIZE
   * MAP HERE" to the console.
   */
  const initializeMap = () => {
    if (map.current) return;
    setInitialize(true);
    console.log("INITIALIE MAP HERE");
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
    // Initializes a map instance using `maptilersdk.Map` API.
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
