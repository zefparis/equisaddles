import { useState, useEffect } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from "../hooks/use-cart";
import { useLanguage } from "../hooks/use-language";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../lib/queryClient";
import { scrollToTop } from "../lib/utils";
import { validatePostalCode, getPostalCodeExample, getPostalCodeMaxLength, formatPostalCode } from "../lib/postal-validation";
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
import DPDShippingOptions from "../components/shipping/dpd-shipping-options";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}

// Stripe iframe detection - warn if loaded in iframe (bad practice)
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
}).refine((data) => validatePostalCode(data.country, data.postalCode), {
  message: "Format de code postal invalide pour ce pays",
  path: ["postalCode"],
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const countries = [
  { code: "BE", name: "Belgique", zone: "domestic" },
  { code: "LU", name: "Luxembourg", zone: "domestic" },
  { code: "FR", name: "France", zone: "europe" },
  { code: "NL", name: "Pays-Bas", zone: "europe" },
  { code: "DE", name: "Allemagne", zone: "europe" },
  { code: "ES", name: "Espagne", zone: "europe" },
  { code: "IT", name: "Italie", zone: "europe" },
  { code: "CH", name: "Suisse", zone: "europe" },
  { code: "AT", name: "Autriche", zone: "europe" },
  { code: "GB", name: "Royaume-Uni", zone: "europe" },
  { code: "US", name: "États-Unis", zone: "international" },
  { code: "CA", name: "Canada", zone: "international" },
];

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { items, totalAmount, clearCart } = useCart();
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({ cost: 0, carrier: "DPD" });
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

  const watchedPostalCode = watch("postalCode");
  const watchedCity = watch("city");
  const watchedCountry = watch("country") || "BE";

  // Effect pour calculer les frais de livraison
  useEffect(() => {
    if (watchedCountry && watchedPostalCode && watchedPostalCode.length > 0) {
      console.log("Calculating shipping for:", watchedCountry, watchedPostalCode);
      calculateShippingWithCountry();
    }
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
    // FIX: Stripe 402 - Validate Stripe readiness before payment
    if (!stripe || !elements) {
      console.error("[StripeFix] Stripe not ready - stripe:", !!stripe, "elements:", !!elements);
      return;
    }

    // FIX: Stripe 429 - Prevent double submission
    if (isProcessing) {
      console.warn("[StripeFix] Payment already processing, ignoring duplicate submission");
      return;
    }

    setIsProcessing(true);
    console.warn("[StripeFix] Starting payment confirmation");

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/confirmation`,
        },
        redirect: 'if_required', // FIX: Stripe 402 - Handle redirect issues
      });

      if (error) {
        // FIX: Stripe 402 - Enhanced error logging and handling
        console.error("[StripeFix] Payment error:", error.type, error.code, error.message);
        
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
        // FIX: Stripe 402 - Only clear cart on confirmed success
        console.warn("[StripeFix] Payment succeeded:", paymentIntent.id);
        clearCart();
        toast({
          title: t("checkout.paymentSuccess"),
          description: t("checkout.paymentSuccessMessage"),
        });
      }
    } catch (error: any) {
      // FIX: Stripe 402 - Better error handling for network/API issues
      console.error("[StripeFix] Payment submission error:", error);
      
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
      // FIX: Stripe 429 - Add delay before allowing new attempts
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

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">{t("checkout.city")} *</Label>
                  <Input
                    id="city"
                    {...register("city")}
                    placeholder={t("checkout.cityPlaceholder")}
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="postalCode">{t("checkout.postalCode")} *</Label>
                  <Controller
                    name="postalCode"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="postalCode"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^a-zA-Z0-9\s-]/g, '');
                          const formatted = formatPostalCode(watchedCountry, value);
                          field.onChange(formatted);
                        }}
                        placeholder={`Ex: ${getPostalCodeExample(watchedCountry)}`}
                        maxLength={getPostalCodeMaxLength(watchedCountry)}
                        className={errors.postalCode ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Format: {getPostalCodeExample(watchedCountry)} ({countries.find(c => c.code === watchedCountry)?.name})
                  </p>
                </div>

                <div>
                  <Label htmlFor="country">{t("checkout.country")} *</Label>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || "BE"}
                        onValueChange={(value) => {
                          console.log("Country changed to:", value);
                          field.onChange(value);
                          setValue("postalCode", "");
                        }}
                      >
                        <SelectTrigger id="country" className={errors.country ? "border-red-500" : ""}>
                          <SelectValue placeholder="Sélectionnez un pays" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name} ({country.zone})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Zone: {countries.find(c => c.code === watchedCountry)?.zone} | 
                    {countries.find(c => c.code === watchedCountry)?.name}
                  </p>
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

  // Scroll to top when page loads
  useEffect(() => {
    scrollToTop();
  }, []);



  // FIX: Stripe 429 - Prevent multiple API calls by using flag and debouncing
  useEffect(() => {
    if (items.length > 0 && !paymentIntentCreated) {
      const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
      
      // FIX: Stripe 402 - Validate amount before API call
      if (totalAmount <= 0) {
        console.warn("[StripeFix] Invalid amount for payment intent:", totalAmount);
        return;
      }

      console.warn("[StripeFix] Creating payment intent for amount:", totalAmount);
      
      apiRequest("POST", "/api/create-payment-intent", { amount: totalAmount })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => {
          // FIX: Stripe 402 - Validate client_secret before setting
          if (data.clientSecret && typeof data.clientSecret === 'string') {
            setClientSecret(data.clientSecret);
            setPaymentIntentCreated(true);
            console.warn("[StripeFix] Payment intent created successfully");
          } else {
            console.error("[StripeFix] Invalid client_secret received:", data);
          }
        })
        .catch((error) => {
          console.error("[StripeFix] Error creating payment intent:", error);
          // FIX: Stripe 429 - Don't block further attempts on network errors
          if (!error.message.includes('429')) {
            setPaymentIntentCreated(false);
          }
        });
    }
  }, [items.length, paymentIntentCreated]); // FIX: Stripe 429 - Use items.length instead of items array

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
