import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { Toaster } from "./components/ui/toaster";
import Admin from "./pages/admin";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Admin} />
      <Route path="/admin" component={Admin} />
      <Route path="/administrateur" component={Admin} />
      <Route component={() => <div>Page non trouvée</div>} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            <Router />
          </main>
        </div>
        <Toaster />
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}

export default App;