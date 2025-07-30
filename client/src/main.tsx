import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("[MAIN] Version PWA V5 - Contraste liens amélioré - " + new Date().toISOString());

// Force cache clearing and immediate update
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then((registration) => {
    // Clear all caches
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
      });
    });
    
    // Force update
    registration.update();
    console.log('[PWA] Cache forcé à se mettre à jour - Version contraste');
  });
}

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
} else {
  console.error("Failed to find root element");
}