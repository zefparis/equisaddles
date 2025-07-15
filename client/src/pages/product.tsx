import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useCart } from "../hooks/use-cart";
import { useLanguage } from "../hooks/use-language";
import { Product } from "@shared/schema";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import Lightbox from "../components/ui/lightbox";
import { ArrowLeft, ShoppingCart, Star, Truck, Shield, RotateCcw } from "lucide-react";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { addItem } = useCart();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-8 w-32 rounded mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-gray-300 h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="bg-gray-300 h-8 rounded"></div>
                <div className="bg-gray-300 h-6 rounded"></div>
                <div className="bg-gray-300 h-4 rounded"></div>
                <div className="bg-gray-300 h-12 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
          <Link href="/catalog">
            <Button>Retour au catalogue</Button>
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [product.image, ...(product.images || [])];
  const hasDiscount = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/catalog" className="flex items-center text-gray-600 hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au catalogue
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-white shadow-md">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => openLightbox(0)}
              />
            </div>
            
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden bg-white shadow-md cursor-pointer hover:opacity-75 transition-opacity"
                    onClick={() => openLightbox(index + 1)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t(`product.description.${product.id}`) || product.description}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-primary">
                {parseFloat(product.price).toFixed(2)} €
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {parseFloat(product.originalPrice!).toFixed(2)} €
                  </span>
                  <Badge className="bg-red-500">
                    -
                    {Math.round(
                      ((parseFloat(product.originalPrice!) - parseFloat(product.price)) /
                        parseFloat(product.originalPrice!)) *
                        100
                    )}
                    %
                  </Badge>
                </>
              )}
            </div>

            {/* Size */}
            <div className="flex items-center space-x-4">
              <span className="font-semibold">{t("product.size")}:</span>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {product.size}
              </Badge>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <span className="text-gray-600">(24 avis)</span>
            </div>

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              className="w-full btn-primary text-lg py-6"
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.inStock ? t("product.addToCart") : t("product.outOfStock")}
            </Button>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600">
                <Truck className="h-5 w-5" />
                <span>Livraison gratuite à partir de 100€</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Shield className="h-5 w-5" />
                <span>Garantie 2 ans</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <RotateCcw className="h-5 w-5" />
                <span>Retour sous 30 jours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6">{t("product.description")}</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
              
              <Separator className="my-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-3">Caractéristiques</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li><span className="font-medium">Catégorie:</span> {product.category}</li>
                    <li><span className="font-medium">Taille:</span> {product.size}</li>
                    <li><span className="font-medium">Matériau:</span> Cuir italien premium</li>
                    <li><span className="font-medium">Couleur:</span> Brun naturel</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Entretien</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Nettoyage régulier avec un savon glycériné</li>
                    <li>• Graissage mensuel avec un baume spécialisé</li>
                    <li>• Stockage dans un endroit sec et aéré</li>
                    <li>• Éviter l'exposition directe au soleil</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lightbox */}
        <Lightbox
          images={allImages}
          currentIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      </div>
    </div>
  );
}
