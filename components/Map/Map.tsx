import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import clsx from "clsx";
import { createContext, ReactNode, useEffect, useRef, useState } from "react";

type ControlLocation =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

type MapTypes = {
  children?: ReactNode;
  isInitialized?: boolean;
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
  attributionControl?: boolean;
  navigationControl?: boolean | ControlLocation;
  terrainControl?: boolean | ControlLocation;
  geolocateControl?: boolean | ControlLocation;
  scaleControl?: boolean | ControlLocation;
  fullscreenControl?: boolean | ControlLocation;
  minimap?: boolean | ControlLocation | maptilersdk.MinimapOptionsInput;
  minZoom?: number;
  maxZoom?: number;
  minPitch?: number;
};

type MapContextTypes = {
  map?: maptilersdk.Map | null;
  styleLoaded?: boolean;
};

export const MapContext = createContext<MapContextTypes>({
  map: null,
  styleLoaded: false,
});

/**
 *
 * @param {boolean} initialize - Whether or not to initialize the map. This is useful if a user wants to add a map high up in the component tree (in order to limit the number of map sessions), but doesn't want to initialize the map until it's needed.
 * @returns
 */
export const Map = ({
  children,
  isInitialized = true,
  className,
  style = maptilersdk.MapStyle.SATELLITE,
  language,
  apiKey,
  center = [139.753, 35.6844],
  zoom = 14,
  bearing = 0,
  pitch = 0,
  bounds,
}: MapTypes) => {
  const [styleLoaded, setStyleLoaded] = useState(false);

  /**
   * map stores map object, and mapContainer is a ref to the container that will hold the map:
   */
  const [map, setMap] = useState<maptilersdk.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);

  /**
   * When isInitialized is set to false, remove the map:
   */
  useEffect(() => {
    return () => {
      if (!isInitialized) map?.remove();
    };
  }, [isInitialized]);

  useEffect(() => {
    console.log("MAP MOUNTED");
    return () => console.log("MAP UNMOUNTED");
  }, []);

  useEffect(() => {
    if (map || !mapContainer.current || !isInitialized) return;
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
    });

    /**
     * Track style load state so that it can be tracked with the useMap() hook:
     */
    newMap.on("style.load", () => setStyleLoaded(true));

    setMap(newMap);
  }, [
    isInitialized,
    apiKey,
    style,
    center,
    zoom,
    language,
    bearing,
    pitch,
    bounds,
  ]);
  return (
    <MapContext.Provider value={{ map, styleLoaded }}>
      {children}
      {/* <div
        className="map-wrap"
        style={{ position: "relative", width: "100%", height: "100%" }}
      > */}
      <div
        className={clsx(className, "map")}
        style={{ position: "absolute", width: "100%", height: "100%" }}
        ref={mapContainer}
      ></div>
      {/* </div> */}
    </MapContext.Provider>
  );
};
