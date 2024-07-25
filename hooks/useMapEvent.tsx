import { useMap } from "$/hooks/useMap";
import { MapEventType } from "@maptiler/sdk";
import { useEffect } from "react";

/**
 * Based on React-Leaflet's comparable useMapEvent() hook:
 * https://github.com/PaulLeCam/react-leaflet/blob/4b71818043fb7308828c17fb927a975833df234c/packages/react-leaflet/src/hooks.ts#L9
 * Allows an easy means to add an event listener to the map within a component.
 * @param {keyof MapEventType} type - The type of event to listen for, such as "click" or "load"
 * @param {(ev: MapEventType[T] & Object) => void} handler - Function that is triggered when the event occurs
 */
export const useMapEvent = <T extends keyof MapEventType>(
  type: T,
  handler: (ev: MapEventType[T] & Object) => void
) => {
  const { map } = useMap();

  /**
   * Add an event listener to the map. When hook unmounts, remove the evet listener:
   */
  useEffect(() => {
    map?.on(type, handler);

    // Remove event handler when component unmounts:
    return () => {
      map?.off(type, handler);
    };
  }, [type, handler]);
};
