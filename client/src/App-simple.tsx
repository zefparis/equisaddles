import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Equi Saddles</h1>
      <p className="text-center text-xl">Boutique spécialisée en selles d'équitation</p>
      <div className="mt-8 text-center">
        <a href="/catalog" className="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block">
          Voir le catalogue
        </a>
      </div>
    </div>
  );
}

function Catalog() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Catalogue des selles</h1>
      <p>Catalogue en cours de chargement...</p>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/catalog" component={Catalog} />
      <Route>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">Page non trouvée</h1>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-white">
        <Router />
      </div>
    </QueryClientProvider>
  );
}

export default App;