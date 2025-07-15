import { Link } from "wouter";
import { useCart } from "../../hooks/use-cart";
import { useLanguage } from "../../hooks/use-language";
import { Product } from "@shared/schema";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter } from "../ui/card";
import { ShoppingCart, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { t } = useLanguage();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
  };

  const hasDiscount = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);

  return (
    <Card className="product-card overflow-hidden">
      <Link href={`/product/${product.id}`}>
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.featured && (
            <Badge className="absolute top-4 right-4 bg-accent">
              {t("product.featured")}
            </Badge>
          )}
          {hasDiscount && (
            <Badge className="absolute top-4 left-4 bg-red-500">
              -
              {Math.round(
                ((parseFloat(product.originalPrice!) - parseFloat(product.price)) /
                  parseFloat(product.originalPrice!)) *
                  100
              )}
              %
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-6">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-2">{t(`product.description.${product.id}`) || product.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">
              {parseFloat(product.price).toFixed(2)} €
            </span>
            {hasDiscount && (
              <span className="text-lg text-gray-500 line-through">
                {parseFloat(product.originalPrice!).toFixed(2)} €
              </span>
            )}
          </div>
          <Badge variant="secondary">{product.size}</Badge>
        </div>

        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400 text-sm">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <span className="ml-2 text-gray-500 text-sm">(24 avis)</span>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button 
          onClick={handleAddToCart}
          className="w-full btn-primary"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {t("product.addToCart")}
        </Button>
      </CardFooter>
    </Card>
  );
}
