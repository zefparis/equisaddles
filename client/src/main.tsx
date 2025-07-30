import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("Main.tsx loading...");
const root = document.getElementById("root");
console.log("Root element found:", root);

if (root) {
  console.log("Creating React root...");
  createRoot(root).render(<App />);
  console.log("App rendered successfully");
} else {
  console.error("CRITICAL: Root element not found!");
}