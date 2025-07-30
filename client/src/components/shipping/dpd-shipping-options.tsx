import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Truck, Clock, MapPin, Package, Euro } from "lucide-react";
import { useLanguage } from "../../hooks/use-language";

interface DPDShippingOption {
  service: string;
  serviceName: string;
  price: number;
  currency: string;
  deliveryTime: string;
  zone: string;
  description: string;
}

interface DPDShippingOptionsProps {
  items: any[];
  country: string;
  postalCode: string;
  city: string;
  onOptionSelect: (option: DPDShippingOption) => void;
  selectedOption?: DPDShippingOption;
}

export default function DPDShippingOptions({
  items,
  country,
  postalCode,
  city,
  onOptionSelect,
  selectedOption
}: DPDShippingOptionsProps) {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculer le poids total (simulation)
  const totalWeight = items.reduce((weight, item) => {
    const itemWeight = 4.0; // Poids moyen d'une selle
    return weight + (itemWeight * item.quantity);
  }, 0);

  // Calculer la valeur totale
  const totalValue = items.reduce((sum, item) => 
    sum + (parseFloat(item.price) * item.quantity), 0
  );

  // PIÈGE CLASSIQUE: Ghost state selection après changement de paramètres
  // Quand country/postalCode/city/items changent, les nouvelles options de livraison
  // ne correspondent plus à la selectedOption précédente. Il faut réinitialiser
  // la sélection pour éviter qu'une option devenue invalide reste affichée.
  // Solution: useEffect qui détecte les changements et reset la sélection.
  useEffect(() => {
    // Reset selection when shipping parameters change
    if (selectedOption) {
      onOptionSelect(undefined as any);
    }
  }, [country, postalCode, city, totalWeight, totalValue]);

  // Récupérer les options de livraison DPD
  const { data: shippingOptions, isLoading } = useQuery<DPDShippingOption[]>({
    queryKey: ["shipping-options", country, postalCode, totalWeight, totalValue],
    queryFn: async () => {
      if (!country || !postalCode) return [];
      
      const response = await apiRequest("POST", "/api/shipping/calculate", {
        weight: totalWeight,
        country,
        postalCode,
        city: city || "",
        value: totalValue
      });
      
      return response.json();
    },
    enabled: !!(country && postalCode && items.length > 0)
  });

  const getServiceIcon = (service: string) => {
    switch (service) {
      case "DPD_EXPRESS":
        return <Clock className="h-4 w-4" />;
      case "DPD_PICKUP":
        return <MapPin className="h-4 w-4" />;
      case "DPD_PREDICT":
        return <Package className="h-4 w-4" />;
      default:
        return <Truck className="h-4 w-4" />;
    }
  };

  const getServiceBadgeColor = (service: string) => {
    switch (service) {
      case "DPD_EXPRESS":
        return "bg-red-100 text-red-800";
      case "DPD_PICKUP":
        return "bg-blue-100 text-blue-800";
      case "DPD_PREDICT":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!country || !postalCode || items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            {t("shipping.dpd.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-4">
            {t("shipping.dpd.addressRequired")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          {t("shipping.dpd.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 w-32 bg-gray-300 rounded"></div>
                  </div>
                  <div className="h-4 w-16 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : shippingOptions?.length === 0 ? (
          <p className="text-gray-600 text-center py-4">
            {t("shipping.dpd.noOptions")}
          </p>
        ) : (
          <div className="space-y-3">
            {shippingOptions?.slice(0, isExpanded ? undefined : 2).map((option) => (
              <div
                key={option.service}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedOption?.service === option.service
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => onOptionSelect(option)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getServiceIcon(option.service)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{option.serviceName}</span>
                        <Badge 
                          variant="secondary" 
                          className={getServiceBadgeColor(option.service)}
                        >
                          {option.zone}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{option.description}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {option.deliveryTime}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 font-semibold">
                      <Euro className="h-4 w-4" />
                      {option.price.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">{option.currency}</div>
                  </div>
                </div>
              </div>
            ))}
            
            {shippingOptions && shippingOptions.length > 2 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full"
              >
                {isExpanded ? t("shipping.dpd.showLess") : t("shipping.dpd.showMore")}
              </Button>
            )}
          </div>
        )}

        {selectedOption && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="font-medium">{t("shipping.dpd.selected")}:</span>
              <div className="flex items-center gap-2">
                <span>{selectedOption.serviceName}</span>
                <Badge variant="secondary">
                  {selectedOption.price.toFixed(2)} €
                </Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}