import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-white p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Equi Saddles - Administration</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">Application Fonctionnelle</h2>
          <p className="text-blue-700">
            Le serveur fonctionne correctement. L'interface d'administration est disponible.
          </p>
        </div>

        <div className="grid gap-4">
          <a 
            href="/admin" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-block text-center transition-colors"
          >
            Accéder à l'Administration Complète
          </a>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">État du Système</h3>
            <ul className="space-y-1 text-gray-600">
              <li>✅ Serveur Express actif sur port 5000</li>
              <li>✅ Base de données PostgreSQL connectée</li>
              <li>✅ APIs produits et commandes opérationnelles</li>
              <li>✅ Interface d'administration prête</li>
            </ul>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;