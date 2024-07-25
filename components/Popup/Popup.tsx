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
   * If lng and lat aren't passed as props, try to get them from parent <Marker> (if it exists):
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
    const popup = new maptilersdk.Popup({
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
    console.log("popup: ", popup);

    /**
     * If JSX children are passed to the <Popup>, render them as DOM content and pass to popup:
     */
    if (innerHTML) {
      const container = convertReactNodeToDomNode(innerHTML);
      popup.setDOMContent(container);
    }

    /**
     * Remove the popup when the component unmounts:
     */
    return () => {
      popup.remove();
    };
  }, []);

  useEffect(() => {
    if (lngLat) popup.current?.setLngLat(lngLat);
  }, [lngLat]);

  return null;
};
