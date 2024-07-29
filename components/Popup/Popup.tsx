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
 * @param children - JSX or text that should be displayed within the popup.
 * @param className - CSS classes to apply to the popup.
 * @param lngLat - LngLatLike containing the coordinates of the popup in the format [lng, lat] or {"lon": lng, "lat": lat}. If a lngLat prop is not passed, it will default to the lngLat of the parent <Marker> (if one exists).
 * @param closeButton - Whether or not to display a button in the corner of the popup that can be used to close it.
 * @param closeOnClick - Whether the popup should close when the map is clicked.
 * @param closeOnMove - Whether the popup should close when the map is moved.
 * @param focusAfterOpen - Whether the popup should focus itself after it has been opened.
 * @param anchor - A string indicating the part of the Popup that should be positioned closest to the coordinate specified in lngLat. Options are 'center', 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', and 'bottom-right'. If unspecified, anchor will be dynamically set to ensure the popup falls within the map container with a preference for 'bottom'.
 * @param offset - A pixel offset applied to the popup's location. Can be specified as a number, PointLike, or object of Points specifying an offset for each anchor position (where negative offsets indicate left and up).
 * @param maxWidth - The maximum width of the popup in pixels.
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
  anchor,
  offset = 40,
  maxWidth,
}: PropTypes) => {
  const { map, styleLoaded } = useMap();

  /**
   * If lngLat isn't passed as props, get it from parent <Marker> (if one exists):
   */
  const { lngLat } = lngLatProp
    ? { lngLat: lngLatProp }
    : useMarkerContext() || {};

  const popup = useRef<maptilersdk.Popup | null>(null);

  useEffect(() => {
    /**
     * Ensure map is initialized and style is loaded before creating the Popup:
     */
    if (!styleLoaded) return;
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
    styleLoaded,
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
