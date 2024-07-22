import { useMap } from "$/hooks/useMap";
import * as maptilersdk from "@maptiler/sdk";
import { ReactNode, useEffect } from "react";

type MarkerType = {
  children?: ReactNode;
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
  element?: HTMLElement;
  lngLat: maptilersdk.LngLatLike;

  /**
   * Event handlers:
   */
  onClick?: (e?: MouseEvent) => void;
  onDragend?: (e?: maptilersdk.MapMouseEvent) => void;
};

export const Marker = ({
  children,
  anchor = "bottom",
  className,
  clickTolerance,
  color,
  draggable,
  element,
  lngLat,
  onClick,
  onDragend,
}: MarkerType) => {
  const map = useMap();

  useEffect(() => {
    if (!map) throw new Error("<Marker> must be a child of <Map>");
    const marker = new maptilersdk.Marker({
      anchor,
      className,
      clickTolerance,
      color,
      draggable,
      element,
    })
      .setLngLat(lngLat)
      .addTo(map);

    /**
     * Add any specified event handlers to the <Marker> if specified:
     */

    /**
     * Marker doesn't support a direct "click" event, so we have to add the click handler to the <Marker>'s element:
     */
    if (onClick) {
      const element = marker.getElement();
      element.addEventListener("click", onClick);
    }

    if (onDragend) marker.on("dragend", onDragend);

    return () => {
      marker.remove();
    };
  }, []);

  return children;
};
