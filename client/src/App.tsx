import { Switch, Route } from "wouter";
import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "./hooks/use-language";
import { CartProvider } from "./hooks/use-cart";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import ChatWidget from "./components/chat/chat-widget";
import ChatButton from "./components/chat/chat-button";
import Home from "./pages/home";
import Catalog from "./pages/catalog";
import ProductPage from "./pages/product";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import Confirmation from "./pages/confirmation";
import Gallery from "./pages/gallery";
import Contact from "./pages/contact";
import Admin from "./pages/admin";
import NotFound from "@/pages/not-found";

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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Router />
              </main>
              <Footer />
            </div>
            <Toaster />
            
            {/* Chat System */}
            <ChatWidget 
              isOpen={isChatOpen} 
              onToggle={() => setIsChatOpen(!isChatOpen)} 
            />
            {!isChatOpen && (
              <ChatButton 
                onClick={() => setIsChatOpen(true)} 
              />
            )}
          </CartProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
