import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("[MAIN] Version PWA mise à jour - Header/Footer corrigés - " + new Date().toISOString());

// Force PWA cache update
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (let registration of registrations) {
      registration.unregister().then(() => {
        console.log('[PWA] Service Worker désenregistré pour mise à jour');
        window.location.reload();
      });
    }
  });
}

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
} else {
  console.error("Failed to find root element");
}