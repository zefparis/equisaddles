import { useEffect } from "react";
import { useLanguage } from "../hooks/use-language";
import { scrollToTop } from "../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { 
  Headphones, 
  Mail, 
  Phone, 
  MessageCircle, 
  Clock, 
  HelpCircle,
  FileText,
  Package,
  CreditCard,
  Truck
} from "lucide-react";

export default function Support() {
  const { t } = useLanguage();

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Headphones className="h-10 w-10 text-primary" />
            {t("legal.support.title")}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("legal.support.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Methods */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  {t("support.contact.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                    <Mail className="h-6 w-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-sm text-gray-600">support@equisaddles.com</p>
                      <Badge variant="secondary" className="mt-1">Réponse sous 24h</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                    <Phone className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold">Téléphone</h3>
                      <p className="text-sm text-gray-600">+33 1 23 45 67 89</p>
                      <Badge variant="secondary" className="mt-1">Lun-Ven 9h-18h</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <h3 className="font-semibold">Horaires de Support</h3>
                  </div>
                  <div className="text-sm space-y-1">
                    <p><strong>Lundi - Vendredi :</strong> 9h00 - 18h00</p>
                    <p><strong>Samedi :</strong> 10h00 - 16h00</p>
                    <p><strong>Dimanche :</strong> Fermé</p>
                    <p className="text-amber-700 mt-2">
                      <strong>Support d'urgence :</strong> Disponible 24h/24 pour les problèmes de commande
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Questions Fréquentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold mb-2">Comment choisir la bonne taille de selle ?</h4>
                    <p className="text-sm text-gray-600">
                      Nos experts sont disponibles pour vous conseiller. Contactez-nous avec les mesures 
                      de votre cheval et votre discipline pour une recommandation personnalisée.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold mb-2">Puis-je échanger ma selle si elle ne convient pas ?</h4>
                    <p className="text-sm text-gray-600">
                      Oui, nous acceptons les échanges dans les 30 jours suivant l'achat, 
                      sous condition que la selle soit en parfait état.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold mb-2">Offrez-vous un service d'entretien ?</h4>
                    <p className="text-sm text-gray-600">
                      Nous proposons des conseils d'entretien détaillés et pouvons vous recommander 
                      des produits spécialisés pour maintenir votre selle en parfait état.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support Categories */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Aide par Catégorie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="h-4 w-4 mr-2" />
                  Produits & Sizing
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Commandes & Paiements
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Truck className="h-4 w-4 mr-2" />
                  Livraison & Retours
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Garantie & SAV
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Qualité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p><strong>Expertise :</strong> Plus de 20 ans d'expérience dans l'équitation</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p><strong>Qualité :</strong> Selles fabriquées par des maîtres selliers</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p><strong>Support :</strong> Accompagnement personnalisé pour chaque client</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p><strong>Satisfaction :</strong> 98% de clients satisfaits</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-12">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Support d'Urgence</h3>
                <p className="text-red-700 mb-4">
                  Pour les problèmes urgents liés à votre commande ou à la sécurité
                </p>
                <Button variant="destructive">
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler le Support d'Urgence
                </Button>
                <p className="text-xs text-red-600 mt-2">
                  Disponible 24h/24 - 7j/7
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}