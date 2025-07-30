import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("[MAIN] Version mise à jour avec header/footer test - " + new Date().toISOString());

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
} else {
  console.error("Failed to find root element");
}