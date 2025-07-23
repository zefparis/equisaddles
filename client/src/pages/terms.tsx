import { useEffect } from "react";
import { useLanguage } from "../hooks/use-language";
import { scrollToTop } from "../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { 
  FileText, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  RotateCcw, 
  AlertTriangle,
  Scale,
  Clock
} from "lucide-react";

export default function Terms() {
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
            <FileText className="h-10 w-10 text-primary" />
            {t("legal.terms.title")}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("legal.terms.subtitle")}
          </p>
          <Badge variant="secondary" className="mt-4">
            {t("legal.version")} : {t("legal.date")}
          </Badge>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Important Notice */}
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-amber-800">
              <strong>{t("legal.important")} :</strong> {t("legal.terms.acceptance")}
            </AlertDescription>
          </Alert>

          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                {t("terms.company.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-primary/5 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Equi Saddles SARL</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Siège social :</strong> 123 Rue de l'Équitation, 75001 Paris, France</p>
                  <p><strong>SIRET :</strong> 123 456 789 00012</p>
                  <p><strong>RCS :</strong> Paris B 123 456 789</p>
                  <p><strong>TVA Intracommunautaire :</strong> FR 12 123456789</p>
                  <p><strong>Capital social :</strong> 50 000 €</p>
                  <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
                  <p><strong>Email :</strong> contact@equisaddles.com</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products & Prices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Produits et Prix
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Nos Produits</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Selles d'équitation de haute qualité (Dressage, Obstacle, Cross, Mixte, Poney)</li>
                    <li>• Accessoires et équipements équestres sélectionnés</li>
                    <li>• Produits neufs exclusivement, avec garantie fabricant</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold mb-2">Tarification</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Prix indiqués en euros (€), toutes taxes comprises (TTC)</li>
                    <li>• TVA applicable : 20% (France métropolitaine)</li>
                    <li>• Frais de livraison calculés selon destination et poids</li>
                    <li>• Prix susceptibles de modification sans préavis</li>
                    <li>• Prix applicable : celui en vigueur au moment de la commande</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders & Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Commandes et Paiement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Processus de Commande</h4>
                  <ul className="text-sm space-y-1">
                    <li>1. Sélection des produits</li>
                    <li>2. Validation du panier</li>
                    <li>3. Saisie des informations</li>
                    <li>4. Choix du mode de livraison</li>
                    <li>5. Paiement sécurisé</li>
                    <li>6. Confirmation par email</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Moyens de Paiement</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Carte bancaire (Visa, Mastercard)</li>
                    <li>• Paiement sécurisé via Stripe</li>
                    <li>• Cryptage SSL 256-bit</li>
                    <li>• Aucune donnée bancaire stockée</li>
                    <li>• Paiement en une fois uniquement</li>
                  </ul>
                </div>
              </div>
              
              <Alert className="bg-green-50 border-green-200">
                <ShieldCheck className="h-4 w-4" />
                <AlertDescription className="text-green-800">
                  <strong>Sécurité :</strong> Vos données de paiement sont protégées par 
                  le standard PCI DSS et ne transitent jamais par nos serveurs.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Delivery */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Livraison et Transport
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  ⚠️ Limitation de Responsabilité - Transport
                </h4>
                <p className="text-sm text-yellow-700">
                  <strong>Equi Saddles n'est pas responsable des dommages, pertes, vols ou retards 
                  causés par le transporteur.</strong> Nous confions vos colis à DPD, transporteur 
                  professionnel, mais ne pouvons être tenus responsables des incidents pendant le transport.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Zones de Livraison</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>France métropolitaine :</strong> 2-3 jours ouvrés</li>
                    <li>• <strong>Europe :</strong> 3-5 jours ouvrés</li>
                    <li>• <strong>International :</strong> 5-10 jours ouvrés</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Options de Livraison</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Livraison standard à domicile</li>
                    <li>• Point relais DPD</li>
                    <li>• Livraison express (selon zones)</li>
                    <li>• Livraison avec créneau horaire</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Responsabilités</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Equi Saddles :</strong> Emballage soigné et remise au transporteur</li>
                    <li>• <strong>Client :</strong> Vérification du colis à réception</li>
                    <li>• <strong>Transporteur (DPD) :</strong> Acheminement et livraison</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Returns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Retours et Rétractation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Droit de Rétractation</h4>
                <p className="text-sm text-blue-700">
                  Conformément au Code de la consommation, vous disposez de 14 jours calendaires 
                  à compter de la réception pour exercer votre droit de rétractation, 
                  sans avoir à justifier de motifs ni à payer de pénalités.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Conditions de Retour</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Produit dans son état d'origine</li>
                    <li>• Emballage d'origine conservé</li>
                    <li>• Aucune trace d'utilisation</li>
                    <li>• Étiquettes et protections intactes</li>
                    <li>• Demande de retour via notre service client</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Procédure de Retour</h4>
                  <ol className="text-sm space-y-1">
                    <li>1. Contactez notre service client sous 14 jours</li>
                    <li>2. Réception d'un bon de retour prépayé</li>
                    <li>3. Emballage soigné du produit</li>
                    <li>4. Envoi via DPD avec le bon de retour</li>
                    <li>5. Remboursement sous 14 jours après réception</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Frais de Retour</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <strong>Article défectueux :</strong> Retour gratuit</li>
                    <li>• <strong>Erreur de notre part :</strong> Retour gratuit</li>
                    <li>• <strong>Rétractation client :</strong> Frais à la charge du client</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warranty */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Garanties et Responsabilité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Garantie Légale</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Garantie de conformité : 2 ans</li>
                    <li>• Garantie contre les vices cachés : 2 ans</li>
                    <li>• SAV et réparations assurés</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Garantie Commerciale</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Échange gratuit sous 30 jours si inadéquation</li>
                    <li>• Conseils d'experts pour le choix de votre selle</li>
                    <li>• Service après-vente dédié</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Limitation de Responsabilité</h4>
                  <div className="text-sm text-red-700 space-y-2">
                    <p>
                      <strong>Equi Saddles limite sa responsabilité aux cas suivants :</strong>
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li>• Dommages directs liés à un défaut de conformité avéré</li>
                      <li>• Montant limité au prix du produit concerné</li>
                      <li>• Exclusion des dommages indirects ou de l'usage</li>
                      <li>• Aucune responsabilité pour les accidents d'équitation</li>
                      <li>• Aucune responsabilité pour les dommages de transport</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Dispositions Légales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Droit Applicable</h4>
                  <p className="text-sm">
                    Les présentes conditions générales sont soumises au droit français. 
                    Tout litige sera de la compétence exclusive des tribunaux de Paris.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Médiation</h4>
                  <p className="text-sm">
                    En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. 
                    Le consommateur peut recourir à une médiation via la plateforme européenne 
                    de résolution des litiges en ligne.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Propriété Intellectuelle</h4>
                  <p className="text-sm">
                    Tous les éléments du site (textes, images, logos) sont protégés par le droit d'auteur. 
                    Toute reproduction sans autorisation est interdite.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Nullité Partielle</h4>
                  <p className="text-sm">
                    Si une clause de ces conditions générales était déclarée nulle, 
                    les autres clauses resteraient pleinement applicables.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-3">Questions sur nos Conditions ?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Notre équipe juridique est à votre disposition pour toute clarification
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email :</strong> legal@equisaddles.com</p>
                  <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
                  <p><strong>Courrier :</strong> Equi Saddles - Service Juridique<br />
                  123 Rue de l'Équitation, 75001 Paris</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}