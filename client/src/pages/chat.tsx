import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import ChatWidget from "@/components/chat/chat-widget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export default function ChatPage() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Récupérer l'email depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    
    if (email) {
      setUserEmail(email);
    } else {
      // Si pas d'email dans l'URL, rediriger vers contact
      setLocation('/contact');
    }
  }, [setLocation]);

  const handleBackToSite = () => {
    setLocation('/');
  };

  if (!userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Chargement de votre conversation...</p>
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

        {/* Chat Container */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <Card className="h-[600px] shadow-lg">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Votre conversation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[520px]">
                  <ChatWidget 
                    isAdmin={false}
                    isOpen={true}
                    userEmail={userEmail}
                    showFullPage={true}
                  />
                </div>
              </CardContent>
            </Card>
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