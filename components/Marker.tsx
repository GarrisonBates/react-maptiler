import { useMap } from "$/hooks/useMap";
import { convertReactNodeToDomNode } from "$/utils/domUtils";
import * as maptilersdk from "@maptiler/sdk";
import { createContext, ReactNode, useContext, useEffect } from "react";

type MarkerType = {
  children?: ReactNode;
  id?: string;
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
  src?: string;
  width?: number;
  height?: number;
  data?: { [key: string]: string };
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
  id,
  lngLat,
  anchor = "bottom",
  className,
  clickTolerance,
  color,
  draggable,
  element: elementProp,
  onClick,
  onDrag,
  onDragend,
  src,
  width = 25,
  height = 41,
  data,
}: MarkerType) => {
  const { map } = useMap();

  useEffect(() => {
    if (!map) throw new Error("<Marker> must be a child of <Map>");

    /**
     * Set the marker's HTML element according to props. If src is provided, create an <img> element with the specified width and height. If element is provided, use it. Otherwise, use the MapTiler default:
     */
    let element;
    if (src) element = <img src={src} width={width} height={height} />;
    else if (elementProp) element = elementProp;
    else element = undefined;

    const marker = new maptilersdk.Marker({
      anchor,
      className,
      clickTolerance,
      color,
      draggable,
      element: element ? convertReactNodeToDomNode(element) : undefined,
    })
      .setLngLat(lngLat)
      .addTo(map);

    /**
     * Add data-* attributes to the marker's HTML element, if specified:
     */
    const el = marker.getElement();
    if (data) {
      for (const [key, value] of Object.entries(data)) {
        el.setAttribute(`data-${key}`, value);
      }
    }
    /**
     * Set the marker's HTML element's id, if specified:
     */
    if (id) el.id = id;

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
