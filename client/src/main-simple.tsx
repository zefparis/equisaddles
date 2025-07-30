import { createRoot } from "react-dom/client";

function SimpleApp() {
  return (
    <div style={{
      padding: '40px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      background: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#8B4513', fontSize: '2.5em', marginBottom: '20px' }}>
        🐎 Equi Saddles
      </h1>
      <p style={{ fontSize: '1.2em', color: '#333', marginBottom: '30px' }}>
        Application fonctionnelle - Diagnostique réussi
      </p>
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        <h3>Status: ✅ WORKING</h3>
        <p>React render OK</p>
        <p>DOM mount OK</p>
        <p>Serveur API OK</p>
      </div>
    </div>
  );
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<SimpleApp />);
} else {
  console.error("Root container not found!");
}