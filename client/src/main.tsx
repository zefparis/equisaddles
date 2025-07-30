import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("main.tsx is loading...");

const root = document.getElementById("root");
console.log("Root element:", root);

if (root) {
  console.log("Creating React root...");
  const reactRoot = createRoot(root);
  console.log("Rendering App...");
  reactRoot.render(<App />);
  console.log("App rendered successfully");
} else {
  console.error("Root element not found");
}