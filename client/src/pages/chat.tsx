import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle } from "lucide-react";

export default function ChatPage() {
  const [, setLocation] = useLocation();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        console.log('Chat page loading...');
        
        const currentUrl = window.location.href;
        const search = window.location.search;
        const urlParams = new URLSearchParams(search);
        const email = urlParams.get('email');
        
        const debug = `
URL complète: ${currentUrl}
Search params: ${search}
Email trouvé: ${email}
Params toString: ${urlParams.toString()}
        `.trim();
        
        setDebugInfo(debug);
        console.log(debug);
        
        if (email && email.includes('@')) {
          console.log('Email valide trouvé:', email);
          setUserEmail(email);
        } else {
          console.log('Aucun email valide');
          setUserEmail(null);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setDebugInfo(`Erreur: ${error}`);
        setIsLoading(false);
        setUserEmail(null);
      }
    }, 100); // Petit délai pour s'assurer que la page est chargée
    
    return () => clearTimeout(timer);
  }, []);

  const handleBackToSite = () => {
    setLocation('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de votre conversation...</p>
        </div>
      </div>
    );
  }

  if (!userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-4">
          <h2 className="text-xl font-semibold mb-2">Email requis</h2>
          <p className="text-muted-foreground mb-4">
            Cette page nécessite un email valide dans l'URL.<br/>
            Format attendu: /chat?email=votre@email.com
          </p>
          <div className="space-y-2">
            <Button onClick={handleBackToSite} variant="outline" className="mr-2">
              Retour au site
            </Button>
            <Button onClick={() => setLocation('/chat-test')} variant="default">
              Page de test
            </Button>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            URL actuelle: {window.location.href}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBackToSite}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au site
            </Button>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MessageCircle className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-primary">
                Equi Saddles - Chat Support
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Continuez votre conversation avec notre équipe
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Connecté en tant que: {userEmail}
            </p>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mb-6">
          <div className="bg-muted/50 rounded-lg p-4 max-w-2xl mx-auto">
            <h3 className="font-semibold mb-2">📋 Informations de Debug</h3>
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
              {debugInfo}
            </pre>
          </div>
        </div>

        {/* Chat Container - Version Simple */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="bg-card rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Chat avec {userEmail}</h2>
              </div>
              
              <div className="bg-muted/30 rounded p-4 h-64 flex items-center justify-center">
                <p className="text-muted-foreground">
                  Interface de chat simplifiée - Email: {userEmail}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center">
          <div className="bg-muted/50 rounded-lg p-4 max-w-2xl mx-auto">
            <h3 className="font-semibold mb-2">💡 Comment ça marche ?</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Vos messages sont sauvegardés automatiquement</li>
              <li>• Vous recevrez un email quand notre équipe vous répond</li>
              <li>• Gardez ce lien pour revenir à tout moment</li>
              <li>• Toutes vos conversations sont regroupées ici</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}