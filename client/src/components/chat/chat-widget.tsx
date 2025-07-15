import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { useLanguage } from "../../hooks/use-language";
import { MessageCircle, Send, X, User, Bot, Minimize2 } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function ChatWidget({ isOpen, onToggle }: ChatWidgetProps) {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message when chat opens
      const welcomeMessage: Message = {
        id: "welcome",
        type: "assistant",
        content: t("chat.welcome"),
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, t]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response (in a real app, this would call an AI service)
    setTimeout(() => {
      const response = generateResponse(inputMessage, language);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateResponse = (message: string, lang: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Common responses based on language
    const responses = {
      fr: {
        greeting: "Bonjour ! Je suis votre assistant Equi Saddles. Comment puis-je vous aider aujourd'hui ?",
        products: "Nous proposons une gamme complète de selles d'équitation : selles d'obstacle, de dressage, de cross et mixtes. Toutes nos selles sont disponibles en tailles 16 à 18.5. Que recherchez-vous spécifiquement ?",
        pricing: "Nos selles sont proposées à partir de 1200€. Les prix varient selon le modèle et les finitions. Consultez notre catalogue pour voir tous les prix.",
        shipping: "Nous livrons dans toute l'Europe. La livraison standard prend 5-7 jours ouvrables. Livraison gratuite pour les commandes de plus de 1500€.",
        sizes: "Nos selles sont disponibles en tailles 16, 16.5, 17, 17.5, 18 et 18.5. Je recommande de mesurer votre cheval ou de consulter un sellier pour choisir la bonne taille.",
        care: "Pour entretenir votre selle, nettoyez-la régulièrement avec un savon glycériné et hydratez le cuir avec une crème spécialisée. Évitez l'humidité excessive.",
        default: "Merci pour votre question ! Pour des informations plus spécifiques, n'hésitez pas à nous contacter directement ou à consulter notre catalogue de produits."
      },
      en: {
        greeting: "Hello! I'm your Equi Saddles assistant. How can I help you today?",
        products: "We offer a complete range of equestrian saddles: jumping, dressage, cross-country and general purpose saddles. All our saddles are available in sizes 16 to 18.5. What are you specifically looking for?",
        pricing: "Our saddles start from €1200. Prices vary according to model and finishes. Check our catalog to see all prices.",
        shipping: "We deliver throughout Europe. Standard delivery takes 5-7 working days. Free delivery for orders over €1500.",
        sizes: "Our saddles are available in sizes 16, 16.5, 17, 17.5, 18 and 18.5. I recommend measuring your horse or consulting a saddler to choose the right size.",
        care: "To maintain your saddle, clean it regularly with glycerin soap and moisturize the leather with specialized cream. Avoid excessive humidity.",
        default: "Thank you for your question! For more specific information, please contact us directly or check our product catalog."
      },
      nl: {
        greeting: "Hallo! Ik ben je Equi Saddles assistent. Hoe kan ik je vandaag helpen?",
        products: "Wij bieden een compleet assortiment paardrijzadels: spring-, dressuur-, cross-country en veelzijdigheidszadels. Al onze zadels zijn verkrijgbaar in maten 16 tot 18.5. Waar ben je specifiek naar op zoek?",
        pricing: "Onze zadels beginnen vanaf €1200. Prijzen variëren afhankelijk van model en afwerking. Bekijk onze catalogus voor alle prijzen.",
        shipping: "Wij leveren door heel Europa. Standaardlevering duurt 5-7 werkdagen. Gratis levering voor bestellingen boven €1500.",
        sizes: "Onze zadels zijn verkrijgbaar in maten 16, 16.5, 17, 17.5, 18 en 18.5. Ik raad aan je paard op te meten of een zadelmaker te raadplegen voor de juiste maat.",
        care: "Om je zadel te onderhouden, maak het regelmatig schoon met glycerinezeep en voorziet het leer van vocht met gespecialiseerde crème. Vermijd overmatige vochtigheid.",
        default: "Bedankt voor je vraag! Voor meer specifieke informatie, neem direct contact met ons op of bekijk onze productcatalogus."
      },
      es: {
        greeting: "¡Hola! Soy tu asistente de Equi Saddles. ¿Cómo puedo ayudarte hoy?",
        products: "Ofrecemos una gama completa de sillas de equitación: salto, doma, cross y mixtas. Todas nuestras sillas están disponibles en tallas 16 a 18.5. ¿Qué estás buscando específicamente?",
        pricing: "Nuestras sillas empiezan desde €1200. Los precios varían según el modelo y acabados. Consulta nuestro catálogo para ver todos los precios.",
        shipping: "Entregamos en toda Europa. La entrega estándar tarda 5-7 días laborables. Envío gratuito para pedidos superiores a €1500.",
        sizes: "Nuestras sillas están disponibles en tallas 16, 16.5, 17, 17.5, 18 y 18.5. Recomiendo medir tu caballo o consultar un talabartero para elegir la talla correcta.",
        care: "Para mantener tu silla, límpiala regularmente con jabón glicerinado e hidrata el cuero con crema especializada. Evita la humedad excesiva.",
        default: "¡Gracias por tu pregunta! Para información más específica, no dudes en contactarnos directamente o consultar nuestro catálogo de productos."
      },
      de: {
        greeting: "Hallo! Ich bin Ihr Equi Saddles Assistent. Wie kann ich Ihnen heute helfen?",
        products: "Wir bieten eine komplette Palette von Reitsätteln: Spring-, Dressur-, Vielseitigkeits- und Allzwecksättel. Alle unsere Sättel sind in den Größen 16 bis 18.5 erhältlich. Was suchen Sie speziell?",
        pricing: "Unsere Sättel beginnen ab €1200. Die Preise variieren je nach Modell und Ausstattung. Schauen Sie sich unseren Katalog für alle Preise an.",
        shipping: "Wir liefern in ganz Europa. Die Standardlieferung dauert 5-7 Werktage. Kostenloser Versand für Bestellungen über €1500.",
        sizes: "Unsere Sättel sind in den Größen 16, 16.5, 17, 17.5, 18 und 18.5 erhältlich. Ich empfehle, Ihr Pferd zu vermessen oder einen Sattler zu konsultieren, um die richtige Größe zu wählen.",
        care: "Um Ihren Sattel zu pflegen, reinigen Sie ihn regelmäßig mit Glycerinseife und befeuchten Sie das Leder mit spezieller Creme. Vermeiden Sie übermäßige Feuchtigkeit.",
        default: "Danke für Ihre Frage! Für spezifischere Informationen kontaktieren Sie uns bitte direkt oder schauen Sie sich unseren Produktkatalog an."
      }
    };

    const langResponses = responses[lang as keyof typeof responses] || responses.en;

    // Simple keyword matching
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("bonjour") || lowerMessage.includes("hallo") || lowerMessage.includes("hola")) {
      return langResponses.greeting;
    }
    if (lowerMessage.includes("product") || lowerMessage.includes("saddle") || lowerMessage.includes("selle") || lowerMessage.includes("zadel") || lowerMessage.includes("silla") || lowerMessage.includes("sattel")) {
      return langResponses.products;
    }
    if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("prix") || lowerMessage.includes("prijs") || lowerMessage.includes("precio") || lowerMessage.includes("preis")) {
      return langResponses.pricing;
    }
    if (lowerMessage.includes("shipping") || lowerMessage.includes("delivery") || lowerMessage.includes("livraison") || lowerMessage.includes("levering") || lowerMessage.includes("envío") || lowerMessage.includes("lieferung")) {
      return langResponses.shipping;
    }
    if (lowerMessage.includes("size") || lowerMessage.includes("taille") || lowerMessage.includes("maat") || lowerMessage.includes("talla") || lowerMessage.includes("größe")) {
      return langResponses.sizes;
    }
    if (lowerMessage.includes("care") || lowerMessage.includes("maintenance") || lowerMessage.includes("entretien") || lowerMessage.includes("onderhoud") || lowerMessage.includes("cuidado") || lowerMessage.includes("pflege")) {
      return langResponses.care;
    }

    return langResponses.default;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <Card className={`fixed bottom-20 right-4 w-80 shadow-lg z-50 transition-all duration-300 ${isMinimized ? 'h-12' : 'h-96'}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bot className="h-4 w-4" />
          {t("chat.title")}
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      {!isMinimized && (
        <CardContent className="flex flex-col h-80">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-2 ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.type === "assistant" && (
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Bot className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] p-2 rounded-lg text-sm ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.type === "user" && (
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                      <User className="h-3 w-3 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Bot className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
          
          <div className="flex gap-2 pt-2 border-t">
            <Input
              placeholder={t("chat.placeholder")}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}