import { useMap } from "$/hooks/useMap";
import * as maptilersdk from "@maptiler/sdk";
import { useEffect } from "react";

type PropTypes = {
  position?: maptilersdk.ControlPosition;
  showCompass?: boolean;
  showZoom?: boolean;
  visualizePitch?: boolean;
};

export const NavigationControl = ({
  position = "top-right",
  showCompass = true,
  showZoom = true,
  visualizePitch = false,
}: PropTypes) => {
  const { map } = useMap();

  useEffect(() => {
    const nav = new maptilersdk.NavigationControl({
      showCompass,
      showZoom,
      visualizePitch,
    });
    map?.addControl(nav, position);

    /**
     * Remove the control when component unmounts:
     */
    return () => {
      map?.removeControl(nav);
    };
  }, [map]);

  return null;
};
