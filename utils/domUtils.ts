import { ReactElement, ReactNode } from "react";
import { createRoot } from "react-dom/client";

/**
 * Converts a ReactNode to a DOM node that's compatible with MapTiler elements.
 * @param {ReactNode} node - The React node to convert to a DOM node
 * @returns {HTMLDivElement} - A <div> element containing the React node
 */
export const convertReactNodeToDomNode = (node: ReactNode | ReactElement) => {
  const container = document.createElement("div");
  const root = createRoot(container);
  root.render(node);
  return container;
};
