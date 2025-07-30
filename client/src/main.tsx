import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./utils/vite-hmr-fix";

// Fix Vite HMR WebSocket errors on Replit
if (typeof window !== 'undefined' && import.meta.hot) {
  try {
    // Catch and gracefully handle WebSocket connection errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const errorMessage = args.join(' ');
      if (errorMessage.includes('WebSocket') && errorMessage.includes('localhost:undefined')) {
        console.warn('[Vite WS fallback] WebSocket connection failed, continuing without HMR:', errorMessage);
        return;
      }
      originalConsoleError.apply(console, args);
    };

    // Accept HMR updates with error handling
    import.meta.hot.accept();
  } catch (e) {
    console.warn("[Vite WS fallback] HMR setup failed:", e);
  }
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[PWAFix] Service Worker registered successfully:', registration.scope);
      })
      .catch((error) => {
        console.error('[PWAFix] Service Worker registration failed:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
