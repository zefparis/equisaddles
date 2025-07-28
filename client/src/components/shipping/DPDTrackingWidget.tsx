import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Package, Truck, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useLanguage } from "../../hooks/use-language";

interface TrackingEvent {
  status: string;
  date: string;
  location: string;
}

interface TrackingInfo {
  trackingNumber: string;
  status: string;
  events: TrackingEvent[];
  estimatedDelivery?: string;
  carrier: string;
}

export default function DPDTrackingWidget() {
  const { t } = useLanguage();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { data: trackingInfo, isLoading, error } = useQuery<TrackingInfo>({
    queryKey: ["tracking", trackingNumber],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/shipping/track/${trackingNumber}`);
      return response.json();
    },
    enabled: submitted && trackingNumber.length > 0,
    retry: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      setSubmitted(true);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "created":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "in_transit":
        return <Truck className="h-5 w-5 text-orange-500" />;
      case "out_for_delivery":
        return <MapPin className="h-5 w-5 text-yellow-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "created":
        return t("tracking.status.created") || "Colis créé";
      case "in_transit":
        return t("tracking.status.in_transit") || "En transit";
      case "out_for_delivery":
        return t("tracking.status.out_for_delivery") || "En cours de livraison";
      case "delivered":
        return t("tracking.status.delivered") || "Livré";
      default:
        return status;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "created":
        return "secondary";
      case "in_transit":
        return "default";
      case "out_for_delivery":
        return "outline";
      case "delivered":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {t("shipping.track_package") || "Suivi de colis DPD"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder={t("shipping.tracking_number_placeholder") || "Numéro de suivi DPD (ex: DPD01234567890)"}
              value={trackingNumber}
              onChange={(e) => {
                setTrackingNumber(e.target.value);
                setSubmitted(false);
              }}
              className="flex-1"
            />
            <Button type="submit" disabled={!trackingNumber.trim()}>
              {t("shipping.track") || "Suivre"}
            </Button>
          </div>
        </form>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              {t("shipping.tracking_error") || "Erreur lors du suivi du colis"}
            </p>
          </div>
        )}

        {trackingInfo && (
          <div className="space-y-4">
            {/* Tracking Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{trackingInfo.trackingNumber}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("shipping.carrier") || "Transporteur"}: {trackingInfo.carrier}
                </p>
              </div>
              <Badge variant={getStatusVariant(trackingInfo.status)}>
                {getStatusText(trackingInfo.status)}
              </Badge>
            </div>

            <Separator />

            {/* Estimated Delivery */}
            {trackingInfo.estimatedDelivery && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {t("shipping.estimated_delivery") || "Livraison estimée"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(trackingInfo.estimatedDelivery).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {/* Tracking Events */}
            <div className="space-y-3">
              <h4 className="font-medium">
                {t("shipping.tracking_history") || "Historique du suivi"}
              </h4>
              <div className="space-y-3">
                {trackingInfo.events.map((event, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    {getStatusIcon(event.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{getStatusText(event.status)}</p>
                        <time className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleString()}
                        </time>
                      </div>
                      {event.location && (
                        <p className="text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          {event.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}