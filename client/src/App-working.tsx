import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";

// Pages simples
import Admin from "./pages/admin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function SimpleHome() {
  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1 style={{ fontSize: '3em', marginBottom: '20px' }}>
        🐎 Equi Saddles
      </h1>
      <p style={{ fontSize: '1.5em', marginBottom: '30px' }}>
        Boutique en ligne de selles d'équitation premium
      </p>
      <div style={{
        background: 'rgba(255,255,255,0.9)',
        color: '#333',
        padding: '30px',
        borderRadius: '12px',
        maxWidth: '600px',
        margin: '0 auto',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
      }}>
        <h2>Application Restaurée ✅</h2>
        <p style={{ marginBottom: '20px' }}>L'application fonctionne maintenant !</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <a href="/admin" style={{
            background: '#8B4513',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
            🔧 Administration
          </a>
          
          <button style={{
            background: '#228B22',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            🛍️ Boutique (Bientôt)
          </button>
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={SimpleHome} />
      <Route path="/admin" component={Admin} />
      <Route component={() => <div>Page non trouvée</div>} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;