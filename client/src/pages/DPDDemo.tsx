import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import DPDShippingOptions from "../components/shipping/dpd-shipping-options";
import DPDTrackingWidget from "../components/shipping/DPDTrackingWidget";
import { Package, Truck, MapPin, Euro, Clock } from "lucide-react";
import { useLanguage } from "../hooks/use-language";

export default function DPDDemo() {
  const { t } = useLanguage();
  const [testOrder, setTestOrder] = useState({
    items: [
      { 
        id: 1, 
        name: "Selle Obstacle Pro", 
        price: "1299.00", 
        quantity: 1, 
        category: "Obstacle" 
      }
    ],
    country: "BE",
    postalCode: "1000",
    city: "Brussels"
  });

  const [selectedShippingOption, setSelectedShippingOption] = useState<any>(null);
  const [generatedLabel, setGeneratedLabel] = useState<any>(null);

  const countries = [
    { code: "BE", name: "Belgique", zone: "domestic" },
    { code: "FR", name: "France", zone: "europe" },
    { code: "DE", name: "Allemagne", zone: "europe" },
    { code: "NL", name: "Pays-Bas", zone: "europe" },
    { code: "ES", name: "Espagne", zone: "europe" },
    { code: "US", name: "États-Unis", zone: "international" },
    { code: "CA", name: "Canada", zone: "international" }
  ];

  const generateTestLabel = async () => {
    if (!selectedShippingOption) return;

    try {
      const response = await fetch("/api/shipping/generate-label", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          orderId: Math.floor(Math.random() * 100000),
          shippingData: {
            customerName: "Test Customer",
            country: testOrder.country,
            postalCode: testOrder.postalCode,
            city: testOrder.city,
            address: "123 Test Street",
            weight: 4.2,
            service: selectedShippingOption?.service
          }
        })
      });

      const label = await response.json();
      setGeneratedLabel(label);
    } catch (error) {
      console.error("Error generating label:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Package className="h-8 w-8" />
          DPD Integration Demo
        </h1>
        <p className="text-lg text-muted-foreground">
          Test complet de l'intégration DPD avec API réelle et système de fallback
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>📦 Expédition depuis:</strong> Equi Saddles - Rue du Vicinal 9, 4141 Louveigné, Belgique
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
            Tous les frais de livraison sont calculés depuis cette adresse belge
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          🔐 API Key: 88c15...d145 (sécurisée côté serveur)
        </Badge>
      </div>

      <Tabs defaultValue="shipping" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="shipping">Calcul de tarifs</TabsTrigger>
          <TabsTrigger value="labels">Génération d'étiquettes</TabsTrigger>
          <TabsTrigger value="tracking">Suivi de colis</TabsTrigger>
        </TabsList>

        {/* Shipping Rate Calculation */}
        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Euro className="h-5 w-5" />
                Configuration de test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Pays de destination</Label>
                  <Select
                    value={testOrder.country}
                    onValueChange={(value) => setTestOrder(prev => ({ ...prev, country: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(country => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name} ({country.zone})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input
                    id="postalCode"
                    value={testOrder.postalCode}
                    onChange={(e) => setTestOrder(prev => ({ ...prev, postalCode: e.target.value }))}
                    placeholder="Ex: 1000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={testOrder.city}
                    onChange={(e) => setTestOrder(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Ex: Brussels"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Article de test</Label>
                <div className="p-3 border rounded-lg bg-muted/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{testOrder.items[0].name}</p>
                      <p className="text-sm text-muted-foreground">
                        Poids: 4.2kg • Valeur: {testOrder.items[0].price}€
                      </p>
                    </div>
                    <Badge variant="secondary">{testOrder.items[0].category}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <DPDShippingOptions
            items={testOrder.items}
            country={testOrder.country}
            postalCode={testOrder.postalCode}
            city={testOrder.city}
            onOptionSelect={setSelectedShippingOption}
            selectedOption={selectedShippingOption}
          />

          {selectedShippingOption && (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">
                  ✅ Option sélectionnée
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{selectedShippingOption.serviceName}</p>
                    <p className="text-sm text-muted-foreground">{selectedShippingOption.description}</p>
                    <p className="text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {selectedShippingOption.deliveryTime}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {selectedShippingOption.price.toFixed(2)} {selectedShippingOption.currency}
                    </p>
                    <Badge variant="outline">{selectedShippingOption.zone}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Label Generation */}
        <TabsContent value="labels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Génération d'étiquettes DPD
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedShippingOption ? (
                <>
                  <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
                    <p className="text-sm">
                      <strong>Service sélectionné:</strong> {selectedShippingOption.serviceName}
                    </p>
                    <p className="text-sm">
                      <strong>Destination:</strong> {testOrder.city}, {testOrder.country} {testOrder.postalCode}
                    </p>
                  </div>
                  
                  <Button onClick={generateTestLabel} className="w-full">
                    Générer une étiquette de test
                  </Button>

                  {generatedLabel && (
                    <div className="p-4 border rounded-lg space-y-2">
                      <h4 className="font-semibold text-green-600">✅ Étiquette générée</h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>Numéro de suivi:</strong> {generatedLabel.trackingNumber}</p>
                        <p><strong>Référence:</strong> {generatedLabel.reference}</p>
                        <p><strong>URL étiquette:</strong> 
                          <a href={generatedLabel.labelUrl} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:underline ml-1">
                            {generatedLabel.labelUrl}
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Sélectionnez d'abord une option de livraison dans l'onglet "Calcul de tarifs"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Package Tracking */}
        <TabsContent value="tracking" className="space-y-6">
          <DPDTrackingWidget />
          
          {generatedLabel && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <MapPin className="h-5 w-5" />
                  Test avec le numéro généré
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Vous pouvez tester le suivi avec le numéro généré ci-dessus:
                </p>
                <code className="bg-muted px-2 py-1 rounded text-sm">
                  {generatedLabel.trackingNumber}
                </code>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* API Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">État de l'intégration DPD</CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Badge variant="secondary" className="mb-1">API Tarifs</Badge>
              <p>✅ Opérationnel avec fallback</p>
            </div>
            <div>
              <Badge variant="secondary" className="mb-1">Génération d'étiquettes</Badge>
              <p>✅ Simulation + API réelle</p>
            </div>
            <div>
              <Badge variant="secondary" className="mb-1">Suivi</Badge>
              <p>✅ Simulation réaliste</p>
            </div>
          </div>
          <Separator />
          <p className="text-muted-foreground">
            <strong>Configuration:</strong> Expédition depuis Louveigné (BE) • Zones: BE/LU (domestic), Europe, International
          </p>
        </CardContent>
      </Card>
    </div>
  );
}