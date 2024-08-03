import { useMap } from "$/hooks/useMap";
import { convertReactNodeToDomNode } from "$/utils/domUtils";
import { ControlPosition, IControl, Map } from "@maptiler/sdk";
import clsx from "clsx";
import { ReactNode, useEffect } from "react";

type PropTypes = {
  children?: ReactNode;
  className?: string;
  position?: ControlPosition;
  onClick?: () => void;
};

/**
 * A custom map control.
 * @param className - CSS classes to apply to the control. It's highly recommended to use the "maplibregl-ctrl" class for this, as it automatically positions the control the same way as the built-in controls. It is also recommended to use "#444853" as the text color, in order to match the default control styles.
 * @returns
 */
export const CustomControl = ({
  children: innerHTML,
  className,
  position = "top-right",
  onClick,
}: PropTypes) => {
  const { map } = useMap();

  class CustomControlClass implements IControl {
    private _map?: Map;
    private _container?: HTMLElement;

    onAdd(map: Map): HTMLElement {
      this._map = map;
      /**
       * Convert the innerHTML prop from JSX to a DOM node and use it for the custom control:
       */
      this._container = convertReactNodeToDomNode(innerHTML);
      this._container.className = clsx("hover:cursor-pointer", className);
      /**
       * Add an onClick handler, if one was passed:
       */
      if (onClick && this._map) this._container.onclick = onClick;
      return this._container;
    }

    onRemove(): void {
      if (this._container && this._container.parentNode) {
        this._container.parentNode.removeChild(this._container);
      }
      this._map = undefined;
    }
  }

  /**
   * Add the control to the map on component mount:
   */
  useEffect(() => {
    const control = new CustomControlClass();
    map?.addControl(control, position);

    /**
     * Remove the control to the map on component unmount:
     */
    return () => {
      map?.removeControl(control);
    };
  }, [map, innerHTML, className, position, onClick]);

  return null;
};
