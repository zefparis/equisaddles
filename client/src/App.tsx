import { QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
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

// Import the queryClient from the lib to get the default queryFn
import { queryClient } from "./lib/queryClient";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import ChatWidget from "./components/chat/chat-widget";


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

export default function App() {
  return (
    <div style={{ background: 'green', color: 'white', padding: '20px' }}>
      <h1>TEST - APP SIMPLE FONCTIONNE</h1>
      <p>Si vous voyez cette page verte, le problème était bien dans les providers</p>
      <a href="/admin" style={{ color: 'yellow' }}>Aller vers admin (qui fonctionne)</a>
    </div>
  );
}