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



const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { items, totalAmount, clearCart } = useCart();
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({ cost: 0, carrier: "Standard" });
  const [selectedShippingOption, setSelectedShippingOption] = useState<any>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    trigger,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: "BE",
      city: "",
      postalCode: "",
      name: "",
      email: "",
      address: "",
      phone: "",
    },
  });

  // UTILISE RHF COMME SEULE SOURCE DE VÉRITÉ
  const watchedCountry = watch("country") || "BE";
  const watchedPostalCode = watch("postalCode");
  const watchedCity = watch("city");

  // Vider le code postal à chaque changement de pays
  useEffect(() => {
    setValue("postalCode", "");
  }, [watchedCountry, setValue]);

  // Calculer les frais de livraison
  useEffect(() => {
    if (watchedCountry && watchedPostalCode && watchedPostalCode.length > 0) {
      calculateShippingWithCountry();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedCountry, watchedPostalCode]);

  const calculateShippingWithCountry = async () => {
    try {
      const response = await apiRequest("POST", "/api/calculate-shipping", {
        postalCode: watchedPostalCode,
        country: watchedCountry,
        items,
      });
      const data = await response.json();
      setShippingInfo({
        cost: parseFloat(data.shippingCost),
        carrier: data.carrier,
      });
    } catch (error) {
      console.error("Error calculating shipping:", error);
      setShippingInfo({ cost: 19.90, carrier: "DPD" });
    }
  };

  const handleShippingOptionSelect = (option: any) => {
    setSelectedShippingOption(option);
    setShippingInfo({
      cost: option.price,
      carrier: option.serviceName,
    });
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (!stripe || !elements) {
      console.error("[StripeFix] Stripe not ready - stripe:", !!stripe, "elements:", !!elements);
      return;
    }

    if (isProcessing) {
      console.warn("[StripeFix] Payment already processing, ignoring duplicate submission");
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/confirmation`,
        },
        redirect: 'if_required',
      });

      if (error) {
        let errorMessage = error.message;
        if (error.type === 'card_error') {
          errorMessage = "Problème avec votre carte. Vérifiez vos informations.";
        } else if (error.type === 'validation_error') {
          errorMessage = "Informations de paiement invalides.";
        } else if (error.code === 'payment_intent_authentication_failure') {
          errorMessage = "Authentification échouée. Réessayez.";
        }

        toast({
          title: t("checkout.paymentError"),
          description: errorMessage,
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        clearCart();
        toast({
          title: t("checkout.paymentSuccess"),
          description: t("checkout.paymentSuccessMessage"),
        });
      }
    } catch (error: any) {
      let errorMessage = t("checkout.errorMessage");
      if (error.message?.includes('402')) {
        errorMessage = "Paiement requis. Vérifiez vos informations de carte.";
      } else if (error.message?.includes('429')) {
        errorMessage = "Trop de tentatives. Attendez un moment avant de réessayer.";
      }

      toast({
        title: t("checkout.error"),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);
    }
  };

  const finalTotal = totalAmount + (selectedShippingOption ? selectedShippingOption.price : shippingInfo.cost);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/cart" className="flex items-center text-gray-600 hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("checkout.backToCart")}
        </Link>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <CreditCard className="h-8 w-8" />
          {t("checkout.title")}
        </h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t("checkout.customerInfo")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">{t("checkout.name")} *</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder={t("checkout.fullName")}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">{t("checkout.email")} *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder={t("checkout.emailPlaceholder")}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="phone">{t("checkout.phone")}</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder={t("checkout.phonePlaceholder")}
                />
              </div>

              <div>
                <Label htmlFor="address">{t("checkout.address")} *</Label>
                <Input
                  id="address"
                  {...register("address")}
                  placeholder={t("checkout.addressPlaceholder")}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>

              {/* Formulaire d'adresse DPD intégré */}
              <div className="space-y-6">
                {/* En-tête DPD */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                        <span className="text-red-600 font-bold text-sm">DPD</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">Adresse de livraison DPD</h3>
                        <p className="text-sm opacity-90">Expédition depuis Louveigné, Belgique</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Champs d'adresse avec validation DPD */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">{t("checkout.city")} *</Label>
                    <Input
                      id="city"
                      {...register("city")}
                      placeholder={t("checkout.cityPlaceholder")}
                      className={`${errors.city ? "border-red-500" : ""} bg-blue-50 dark:bg-gray-800`}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="postalCode">
                      {t("checkout.postalCode")} *
                      <span className="text-xs text-muted-foreground ml-1">
                        ({watchedCountry === 'BE' ? '4 chiffres' : watchedCountry === 'FR' ? '5 chiffres' : 'Variable'})
                      </span>
                    </Label>
                    <Input
                      id="postalCode"
                      {...register("postalCode")}
                      placeholder={watchedCountry === 'BE' ? '4141' : watchedCountry === 'FR' ? '75001' : 'Code postal'}
                      maxLength={watchedCountry === 'BE' ? 4 : watchedCountry === 'FR' ? 5 : 10}
                      className={`${errors.postalCode ? "border-red-500" : ""} bg-blue-50 dark:bg-gray-800`}
                    />
                    {errors.postalCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Format: {watchedCountry === 'BE' ? '4141 (4 chiffres)' : watchedCountry === 'FR' ? '75001 (5 chiffres)' : 'Selon pays'}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="country">{t("checkout.country")} *</Label>
                    <select
                      id="country"
                      {...register("country")}
                      onChange={(e) => {
                        setValue("country", e.target.value);
                        setValue("postalCode", "");
                      }}
                      className={`flex h-10 w-full rounded-md border border-input bg-blue-50 dark:bg-gray-800 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.country ? "border-red-500" : ""
                      }`}
                    >
                      <option value="BE">🇧🇪 Belgique (Zone domestique)</option>
                      <option value="LU">🇱🇺 Luxembourg (Zone domestique)</option>
                      <option value="FR">🇫🇷 France (Zone Europe)</option>
                      <option value="NL">🇳🇱 Pays-Bas (Zone Europe)</option>
                      <option value="DE">🇩🇪 Allemagne (Zone Europe)</option>
                      <option value="ES">🇪🇸 Espagne (Zone Europe)</option>
                      <option value="IT">🇮🇹 Italie (Zone Europe)</option>
                      <option value="CH">🇨🇭 Suisse (Zone Europe)</option>
                      <option value="AT">🇦🇹 Autriche (Zone Europe)</option>
                      <option value="GB">🇬🇧 Royaume-Uni (Zone Internationale)</option>
                      <option value="US">🇺🇸 États-Unis (Zone Internationale)</option>
                      <option value="CA">🇨🇦 Canada (Zone Internationale)</option>
                    </select>
                    {errors.country && (
                      <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      <strong>Expédition depuis:</strong> Rue du Vicinal 9, 4141 Louveigné, Belgique
                    </p>
                  </div>
                </div>

                {/* Informations de validation DPD */}
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border">
                  <div className="flex items-start gap-2">
                    <div className="text-red-600 mt-0.5">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                        Validation d'adresse DPD
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        Codes postaux: Belgique (4 chiffres), France (5 chiffres).
                        L'adresse sera validée automatiquement par le système DPD.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* DPD Shipping Options */}
              <div className="mb-6">
                <DPDShippingOptions
                  items={items}
                  country={watchedCountry}
                  postalCode={watchedPostalCode}
                  city={watchedCity}
                  onOptionSelect={handleShippingOptionSelect}
                  selectedOption={selectedShippingOption}
                />
              </div>

              <Separator className="my-6" />

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
                {isProcessing ? "Traitement..." : `${t("checkout.payWithStripe")} - ${finalTotal.toFixed(2)} €`}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Résumé de la commande</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-600">
                    {item.category} - {item.size} - Qté: {item.quantity}
                  </p>
                  <p className="font-semibold text-primary">
                    {(parseFloat(item.price) * item.quantity).toFixed(2)} €
                  </p>
                </div>
              </div>
            ))}

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{totalAmount.toFixed(2)} €</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  <span>Livraison ({shippingInfo.carrier})</span>
                </div>
                <span>
                  {shippingInfo.cost === 0 ? (
                    <span className="text-green-600 font-semibold">Gratuite</span>
                  ) : (
                    `${shippingInfo.cost.toFixed(2)} €`
                  )}
                </span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{finalTotal.toFixed(2)} €</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function Checkout() {
  const { items } = useCart();
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentCreated, setPaymentIntentCreated] = useState(false);

  useEffect(() => {
    scrollToTop();
  }, []);

  useEffect(() => {
    // Create PaymentIntent with anti-spam protection and iframe detection
    if (items.length > 0 && !paymentIntentCreated && !clientSecret) {
      const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
      if (totalAmount <= 0) {
        console.warn("[StripeFix] Invalid amount for payment intent:", totalAmount);
        return;
      }

      // Check iframe and log Stripe configuration
      StripeErrorHandler.checkIframeWarning();
      StripeErrorHandler.logStripeConfig();

      // Add delay to prevent rapid successive calls that cause 429 errors
      const createPaymentIntent = setTimeout(() => {
        console.log("[StripeFix] Creating payment intent for amount:", totalAmount);
        
        apiRequest("POST", "/api/create-payment-intent", { amount: totalAmount })
          .then((res) => {
            if (!res.ok) {
              throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }
            return res.json();
          })
          .then((data) => {
            if (data.clientSecret && typeof data.clientSecret === 'string') {
              console.log("[StripeFix] Payment intent created successfully");
              setClientSecret(data.clientSecret);
              setPaymentIntentCreated(true);
            } else {
              console.error("[StripeFix] Invalid client_secret received:", data);
            }
          })
          .catch((error) => {
            console.error("[StripeFix] Error creating payment intent:", error);
            
            const errorInfo = StripeErrorHandler.handleApiError(error);
            
            if (errorInfo.shouldRetry) {
              console.warn(`[StripeFix] ${errorInfo.userMessage} Retrying in ${errorInfo.retryDelay}ms`);
              setTimeout(() => {
                setPaymentIntentCreated(false);
              }, errorInfo.retryDelay);
            } else {
              console.error(`[StripeFix] ${errorInfo.userMessage}`);
              setPaymentIntentCreated(false);
            }
          });
      }, 500); // 500ms delay to prevent rapid calls

      return () => clearTimeout(createPaymentIntent);
    }
  }, [items.length, paymentIntentCreated, clientSecret]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Panier vide</h1>
          <p className="text-gray-600 mb-8">Votre panier est vide</p>
          <Link href="/catalog">
            <Button>Voir le catalogue</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}
