import { useState, useEffect } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from "../hooks/use-cart";
import { useLanguage } from "../hooks/use-language";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../lib/queryClient";
import { scrollToTop } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { ArrowLeft, CreditCard, Truck } from "lucide-react";
import { StripeErrorHandler } from "../utils/stripe-error-handler";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}

if (window.self !== window.top) {
  console.warn('[StripeFix] WARNING: Stripe is being loaded in an iframe. This is a security risk and may cause payment failures. Load Stripe in the main window instead.');
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const checkoutSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  address: z.string().min(5, "L'adresse est requise"),
  city: z.string().min(2, "La ville est requise"),
  postalCode: z.string().min(1, "Le code postal est requis"),
  country: z.string().min(2, "Le pays est requis"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const countries = [
  { code: 'BE', name: 'Belgique' },
  { code: 'FR', name: 'France' },
  { code: 'NL', name: 'Pays-Bas' },
  { code: 'DE', name: 'Allemagne' },
  { code: 'ES', name: 'Espagne' },
  { code: 'IT', name: 'Italie' },
  { code: 'LU', name: 'Luxembourg' },
];

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { items, totalAmount, clearCart } = useCart();
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: 'BE'
    }
  });

  const watchedCountry = watch('country');

  // Calculate shipping when country changes
  useEffect(() => {
    if (watchedCountry) {
      let cost = 0;
      if (watchedCountry === 'BE') {
        cost = 7.50;
      } else if (['FR', 'NL', 'DE', 'LU'].includes(watchedCountry)) {
        cost = 12.90;
      } else {
        cost = 19.90;
      }
      setShippingCost(cost);
    }
  }, [watchedCountry]);

  const finalTotal = totalAmount + shippingCost;

  const onSubmit = async (data: CheckoutFormData) => {
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create checkout session
      const response = await apiRequest("POST", "/api/create-payment-intent", {
        items,
        customerInfo: data,
        shippingCost
      });

      const data_response = await response.json();
      const { clientSecret } = data_response;

      if (clientSecret) {
        window.location.href = clientSecret;
      } else {
        throw new Error("No payment URL received");
      }
    } catch (error: any) {
      console.error('[StripeFix] Payment error:', error);
      const handledError = StripeErrorHandler.handleApiError(error);
      toast({
        title: "Erreur de paiement",
        description: handledError.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Link href="/cart">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au panier
            </Button>
          </Link>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Finaliser la commande
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Customer Information */}
          <div>
            <Label className="text-lg font-semibold mb-4 block">Informations personnelles</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom complet *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Shipping Address */}
          <div>
            <Label className="text-lg font-semibold mb-4 block flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Adresse de livraison
            </Label>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Adresse *</Label>
                <Input
                  id="address"
                  {...register("address")}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    {...register("city")}
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="postalCode">Code postal *</Label>
                  <Input
                    id="postalCode"
                    {...register("postalCode")}
                    className={errors.postalCode ? "border-red-500" : ""}
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="country">Pays *</Label>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="country" className={errors.country ? "border-red-500" : ""}>
                          <SelectValue placeholder="Sélectionner un pays" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div>
            <Label className="text-lg font-semibold mb-4 block">Résumé de la commande</Label>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Sous-total ({items.length} article{items.length > 1 ? 's' : ''})</span>
                <span>{totalAmount.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span>{shippingCost.toFixed(2)} €</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{finalTotal.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment */}
          <div>
            <Label className="text-lg font-semibold mb-4 block">Informations de paiement</Label>
            <div className="p-4 border rounded-lg bg-gray-50">
              <PaymentElement />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full btn-primary text-lg py-6"
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? "Traitement..." : `Payer ${finalTotal.toFixed(2)} € avec Stripe`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default function Checkout() {
  const { items } = useCart();

  useEffect(() => {
    scrollToTop();
  }, []);

  if (!items.length) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
        <Link href="/catalog">
          <Button>Retourner au catalogue</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}