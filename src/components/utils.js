import { createRoot } from "react-dom/client";

export const AppendChild = (el, child) => {
  const newDiv = document.createElement("div");
  el.appendChild(newDiv);
  const root = createRoot(newDiv);
  root.render(child);
};
