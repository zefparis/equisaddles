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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { ArrowLeft, CreditCard, Truck } from "lucide-react";
import DPDShippingOptions from "../components/shipping/dpd-shipping-options";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const checkoutSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  address: z.string().min(5, "L'adresse est requise"),
  city: z.string().min(2, "La ville est requise"),
  postalCode: z.string().min(5, "Le code postal est requis"),
  country: z.string().min(2, "Le pays est requis"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const countries = [
  { code: "FR", name: "France" },
  { code: "BE", name: "Belgique" },
  { code: "NL", name: "Pays-Bas" },
  { code: "DE", name: "Allemagne" },
  { code: "ES", name: "Espagne" },
  { code: "IT", name: "Italie" },
  { code: "CH", name: "Suisse" },
  { code: "LU", name: "Luxembourg" },
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
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: "FR",
    },
  });

  const watchedCountry = watch("country");
  const watchedPostalCode = watch("postalCode");

  useEffect(() => {
    if (watchedCountry && watchedPostalCode) {
      calculateShipping();
    }
  }, [watchedCountry, watchedPostalCode]);

  const calculateShipping = async () => {
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
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/confirmation`,
        },
      });

      if (error) {
        toast({
          title: t("checkout.paymentError"),
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Clear cart on successful payment
        clearCart();
        toast({
          title: t("checkout.paymentSuccess"),
          description: t("checkout.paymentSuccessMessage"),
        });
      }
    } catch (error) {
      toast({
        title: t("checkout.error"),
        description: t("checkout.errorMessage"),
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
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
                    placeholder="Jean Dupont"
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
                    placeholder="jean.dupont@email.com"
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
                  placeholder="+32 496 94 41 25"
                />
              </div>

              <div>
                <Label htmlFor="address">{t("checkout.address")} *</Label>
                <Input
                  id="address"
                  {...register("address")}
                  placeholder="123 Rue de l'Équitation"
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
                    placeholder="Paris"
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="postalCode">{t("checkout.postalCode")} *</Label>
                  <Input
                    id="postalCode"
                    {...register("postalCode")}
                    placeholder="75000"
                    className={errors.postalCode ? "border-red-500" : ""}
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="country">{t("checkout.country")} *</Label>
                  <Select value={watchedCountry} onValueChange={(value) => register("country").onChange({ target: { value } })}>
                    <SelectTrigger className={errors.country ? "border-red-500" : ""}>
                      <SelectValue placeholder="Sélectionnez un pays" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              {/* DPD Shipping Options */}
              <div className="mb-6">
                <DPDShippingOptions
                  items={items}
                  country={watchedCountry}
                  postalCode={watchedPostalCode}
                  city={watch("city")}
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

  // Scroll to top when page loads
  useEffect(() => {
    scrollToTop();
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
      
      apiRequest("POST", "/api/create-payment-intent", { amount: totalAmount })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          console.error("Error creating payment intent:", error);
        });
    }
  }, [items]);

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
