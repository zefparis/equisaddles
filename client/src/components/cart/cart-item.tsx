import { useCart, CartItem as CartItemType } from "../../hooks/use-cart";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Minus, Plus, X } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-md"
      />
      
      <div className="flex-1">
        <h4 className="font-medium text-sm">{item.name}</h4>
        <p className="text-gray-600 text-xs">{item.category} - {item.size}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-primary">
            {parseFloat(item.price).toFixed(2)} €
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Badge variant="secondary" className="px-2 py-1 min-w-[2rem] text-center">
              {item.quantity}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => removeItem(item.id)}
        className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
