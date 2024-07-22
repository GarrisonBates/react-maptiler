import { useMap } from "$/hooks/useMap";
import { convertReactNodeToDomNode } from "$/utils/domUtils";
import * as maptilersdk from "@maptiler/sdk";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type MarkerType = {
  children?: ReactNode;
  lngLat: maptilersdk.LngLatLike;
  anchor?:
    | "center"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  className?: string;
  clickTolerance?: number;
  color?: string;
  draggable?: boolean;
  element?: ReactNode;
  /**
   * Event handlers:
   */
  onClick?: (e?: MouseEvent) => void;
  onDrag?: (e?: maptilersdk.MapMouseEvent) => void;
  onDragend?: (e?: maptilersdk.MapMouseEvent) => void;
};

type MarkerContextType = {
  lngLat: maptilersdk.LngLatLike;
};

const MarkerContext = createContext<MarkerContextType | null>(null);

export const useMarkerContext = () => useContext(MarkerContext);

/**
 * Binding for MapTiler Marker element.
 * @returns
 */
export const Marker = ({
  children,
  lngLat: lngLatProp,
  anchor = "bottom",
  className,
  clickTolerance,
  color,
  draggable,
  element,
  onClick,
  onDrag,
  onDragend,
}: MarkerType) => {
  const map = useMap();
  const [lngLat, setLngLat] = useState(lngLatProp);
  console.log("lngLat: ", lngLat);

  useEffect(() => {
    if (!map) throw new Error("<Marker> must be a child of <Map>");
    const marker = new maptilersdk.Marker({
      anchor,
      className,
      clickTolerance,
      color,
      draggable,
      element: convertReactNodeToDomNode(element),
    })
      .setLngLat(lngLat)
      .addTo(map);

    /**
     * Marker doesn't support a direct "click" event, so we have to add the click handler to the <Marker>'s element:
     */
    if (onClick) {
      const element = marker.getElement();
      element.addEventListener("click", onClick);
    }

    if (onDrag) marker.on("drag", onDrag);

    if (onDragend) marker.on("dragend", onDragend);

    return () => {
      marker.remove();
    };
  }, []);

  return (
    <MarkerContext.Provider value={{ lngLat }}>
      {children}
    </MarkerContext.Provider>
  );
};
