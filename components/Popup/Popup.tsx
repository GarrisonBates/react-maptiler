import { useMarkerContext } from "$/components/Marker";
import { useMap } from "$/hooks/useMap";
import { convertReactNodeToDomNode } from "$/utils/domUtils";
import * as maptilersdk from "@maptiler/sdk";
import { ReactNode, useEffect, useRef } from "react";

type PropTypes = {
  children?: ReactNode;
  className?: string;
  lngLat?: maptilersdk.LngLatLike;
  closeButton?: boolean;
  closeOnClick?: boolean;
  closeOnMove?: boolean;
  focusAfterOpen?: boolean;
  anchor?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  offset?: maptilersdk.Offset;
  maxWidth?: string;
};

/**
 * Represents a Popup on the map, which is typically (but not necessarily) associated with a Marker and usually contains text or HTML content.
 * @param children - JSX content that should be displayed within the popup
 * @param className - CSS classes to apply to the popup
 * 
 * @returns 
 */
export const Popup = ({
  children: innerHTML,
  className,
  lngLat: lngLatProp,
  closeButton,
  closeOnClick = true,
  closeOnMove = true,
  focusAfterOpen = true,
  anchor = "bottom",
  offset = 40,
  maxWidth,
}: PropTypes) => {
  const { map } = useMap();
  /**
   * If lngLat isn't passed as props, get it from parent <Marker> (if one exists):
   */
  const { lngLat } = lngLatProp
    ? { lngLat: lngLatProp }
    : useMarkerContext() || {};

  const popup = useRef<maptilersdk.Popup | null>(null);

  useEffect(() => {
    if (!map) throw new Error("<Popup> must be a child of <Map>");
    if (!lngLat)
      throw new Error(
        "<Popup> must have lng and lat, or be a child of <Marker>"
      );
    const newPopup = new maptilersdk.Popup({
      className,
      closeButton,
      closeOnClick,
      closeOnMove,
      focusAfterOpen,
      anchor,
      offset,
      maxWidth,
    })
      .setLngLat(lngLat)
      .addTo(map);

    /**
     * If JSX children are passed to the <Popup>, render them as DOM content and pass to popup:
     */
    if (innerHTML) {
      const container = convertReactNodeToDomNode(innerHTML);
      newPopup.setDOMContent(container);
    }

    /**
     * Save popup in ref for later access:
     */
    popup.current = newPopup;

    /**
     * Remove the popup when the component unmounts:
     */
    return () => {
      newPopup.remove();
    };
  }, [
    className,
    closeButton,
    closeOnClick,
    closeOnMove,
    focusAfterOpen,
    anchor,
    offset,
    maxWidth,
  ]);

  /**
   * Update popup's coordinates when updated:
   */
  useEffect(() => {
    if (lngLat) popup.current?.setLngLat(lngLat);
  }, [lngLat]);

  return null;
};
