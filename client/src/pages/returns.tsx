import { useEffect } from "react";
import { useLanguage } from "../hooks/use-language";
import { scrollToTop } from "../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { 
  RotateCcw, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Mail, 
  FileText,
  Truck,
  CreditCard,
  AlertTriangle,
  Phone
} from "lucide-react";

export default function Returns() {
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
            <RotateCcw className="h-10 w-10 text-primary" />
            Retours et Échanges
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Politique de retour flexible d'Equi Saddles. Votre satisfaction est notre priorité, 
            nous facilitons vos retours et échanges.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Quick Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-800">14 Jours</h3>
                <p className="text-sm text-green-700">pour exercer votre droit de rétractation</p>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-800">30 Jours</h3>
                <p className="text-sm text-blue-700">pour un échange si inadéquation</p>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <CreditCard className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-800">Remboursement</h3>
                <p className="text-sm text-purple-700">intégral sous 14 jours</p>
              </CardContent>
            </Card>
          </div>

          {/* Return Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Politique de Retour
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-blue-50 border-blue-200">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-blue-800">
                  <strong>Satisfait ou Remboursé :</strong> Nous nous engageons à ce que votre selle 
                  vous convienne parfaitement. Si ce n'est pas le cas, nous facilitons votre retour.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Retours Acceptés
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>Selle inadaptée à votre cheval</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>Produit défectueux ou endommagé</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>Erreur de commande de notre part</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>Droit de rétractation (14 jours)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span>Produit non conforme à la description</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    Retours Refusés
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>Selle utilisée ou montée</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>Étiquettes retirées ou endommagées</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>Emballage d'origine détérioré</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>Délai de 14 jours dépassé</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <span>Produits personnalisés</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Return Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Procédure de Retour
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Badge className="min-w-8 h-8 rounded-full flex items-center justify-center">1</Badge>
                  <div>
                    <h4 className="font-semibold mb-1">Contactez notre Service Client</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Envoyez-nous un email à <strong>returns@equisaddles.com</strong> ou appelez-nous 
                      au <strong>+33 1 23 45 67 89</strong> dans les 14 jours suivant la réception.
                    </p>
                    <p className="text-sm text-gray-500">
                      Informations à fournir : numéro de commande, motif du retour, photos si défaut.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Badge className="min-w-8 h-8 rounded-full flex items-center justify-center">2</Badge>
                  <div>
                    <h4 className="font-semibold mb-1">Autorisation de Retour</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Nous vous envoyons par email un numéro RMA (Return Merchandise Authorization) 
                      et une étiquette de retour prépayée.
                    </p>
                    <p className="text-sm text-gray-500">
                      Délai de traitement : 24h ouvrées maximum.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Badge className="min-w-8 h-8 rounded-full flex items-center justify-center">3</Badge>
                  <div>
                    <h4 className="font-semibold mb-1">Préparation du Colis</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Remballez soigneusement la selle dans son emballage d'origine avec 
                      toutes les protections. Incluez le numéro RMA dans le colis.
                    </p>
                    <p className="text-sm text-gray-500">
                      Conseil : Photographiez l'emballage avant envoi.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Badge className="min-w-8 h-8 rounded-full flex items-center justify-center">4</Badge>
                  <div>
                    <h4 className="font-semibold mb-1">Expédition</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Collez l'étiquette de retour et déposez le colis dans un point DPD ou 
                      programmez un enlèvement à domicile.
                    </p>
                    <p className="text-sm text-gray-500">
                      Conservez le récépissé de dépôt comme preuve d'envoi.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Badge className="min-w-8 h-8 rounded-full flex items-center justify-center">5</Badge>
                  <div>
                    <h4 className="font-semibold mb-1">Traitement et Remboursement</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Dès réception, nous vérifions l'état du produit. Si conforme, 
                      remboursement sous 14 jours sur votre moyen de paiement initial.
                    </p>
                    <p className="text-sm text-gray-500">
                      Vous recevez un email de confirmation à chaque étape.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exchange Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Politique d'Échange
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Échange Gratuit Spécial</h4>
                <p className="text-sm text-green-700">
                  <strong>Selle inadaptée :</strong> Si après expertise, votre selle s'avère inadaptée 
                  à votre cheval, nous proposons un échange gratuit vers un modèle plus approprié 
                  dans les 30 jours suivant l'achat.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Conditions d'Échange</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Selle en parfait état, non utilisée</li>
                    <li>• Expertise par notre sellier partenaire (recommandé)</li>
                    <li>• Différence de prix éventuelle à régler</li>
                    <li>• Un seul échange autorisé par commande</li>
                    <li>• Frais de port pris en charge par Equi Saddles</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Types d'Échanges</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-l-4 border-blue-500 pl-3">
                      <h5 className="font-medium text-blue-800">Changement de Taille</h5>
                      <p className="text-sm text-blue-600">
                        Même modèle, taille différente - Échange gratuit
                      </p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-3">
                      <h5 className="font-medium text-purple-800">Changement de Modèle</h5>
                      <p className="text-sm text-purple-600">
                        Modèle différent - Différence de prix applicable
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Costs & Refunds */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Frais et Remboursements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Frais de Retour</h4>
                  <div className="space-y-3">
                    <div className="bg-green-50 p-3 rounded">
                      <h5 className="font-medium text-green-800">Gratuit</h5>
                      <ul className="text-sm text-green-700 mt-1">
                        <li>• Produit défectueux</li>
                        <li>• Erreur de notre part</li>
                        <li>• Échange inadéquation</li>
                      </ul>
                    </div>
                    
                    <div className="bg-orange-50 p-3 rounded">
                      <h5 className="font-medium text-orange-800">À votre charge</h5>
                      <ul className="text-sm text-orange-700 mt-1">
                        <li>• Rétractation simple</li>
                        <li>• Changement d'avis</li>
                        <li>• Coût : 15-25€ selon zone</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Modalités de Remboursement</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Délai de traitement :</span>
                      <span className="font-medium">3-5 jours ouvrés</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Délai de remboursement :</span>
                      <span className="font-medium">14 jours max</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Moyen de paiement :</span>
                      <span className="font-medium">Carte bancaire d'origine</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frais de livraison :</span>
                      <span className="font-medium">Non remboursés*</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    *Sauf défaut ou erreur de notre part
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transport Responsibility */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <Truck className="h-5 w-5" />
                Responsabilité Transport
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="bg-yellow-100 border-yellow-300">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-yellow-800">
                  <strong>Important :</strong> Equi Saddles n'est pas responsable des dommages, 
                  pertes ou retards causés par le transporteur pendant le retour. 
                  Nous recommandons fortement d'assurer vos envois de valeur.
                </AlertDescription>
              </Alert>
              
              <div className="mt-4 space-y-2 text-sm">
                <h5 className="font-semibold">Nos Recommandations :</h5>
                <ul className="space-y-1">
                  <li>• Emballez soigneusement avec protection renforcée</li>
                  <li>• Photographiez l'emballage avant envoi</li>
                  <li>• Conservez tous les récépissés de transport</li>
                  <li>• Déclarez la valeur réelle du produit</li>
                  <li>• Utilisez l'étiquette de retour fournie par nos soins</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-primary/5">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Une Question sur votre Retour ?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    returns@equisaddles.com
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    +33 1 23 45 67 89
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Service client disponible du lundi au vendredi, 9h-18h<br />
                  Réponse garantie sous 24h ouvrées
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}