import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { LanguageProvider } from "./hooks/use-language";
import { CartProvider } from "./hooks/use-cart";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { Toaster } from "./components/ui/toaster";

// Pages
import Home from "./pages/home";
import Catalog from "./pages/catalog";
import ProductPage from "./pages/product";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import Confirmation from "./pages/confirmation";
import Gallery from "./pages/gallery";
import Contact from "./pages/contact";
import Admin from "./pages/admin";
import Support from "./pages/support";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";
import Returns from "./pages/returns";
import Delivery from "./pages/delivery";
import CustomerService from "./pages/customer-service";
import NotFound from "./pages/not-found";

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
      <Route path="/" component={Home} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/product/:id" component={ProductPage} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/confirmation" component={Confirmation} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin" component={Admin} />
      <Route path="/administrateur" component={Admin} />
      <Route path="/support" component={Support} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/returns" component={Returns} />
      <Route path="/delivery" component={Delivery} />
      <Route path="/customer-service" component={CustomerService} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <CartProvider>
          <AdminAuthProvider>
            <div className="min-h-screen flex flex-col">
              <main className="flex-1">
                <Router />
              </main>
            </div>
            <Toaster />
          </AdminAuthProvider>
        </CartProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;