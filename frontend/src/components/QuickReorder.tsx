import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { RotateCcw, ShoppingCart } from 'lucide-react';

export const QuickReorder: React.FC = () => {
  const { orders } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const recentOrders = orders
    .filter(order => order.status === 'delivered')
    .slice(0, 3);

  const handleReorder = (order: any) => {
    let itemsAdded = 0;
    
    order.items.forEach((item: any) => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        selectedFlavor: item.flavor,
        selectedWeight: item.weight,
        quantity: item.quantity
      });
      itemsAdded++;
    });

    toast({
      title: "Items Added to Cart",
      description: `${itemsAdded} items from order #${order.orderNumber} added to cart.`
    });
  };

  if (recentOrders.length === 0) return null;

  return (
    <Card className="border-green-200">
      <CardHeader className="bg-green-50">
        <CardTitle className="flex items-center text-green-800">
          <RotateCcw className="h-5 w-5 mr-2" />
          Quick Reorder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        <p className="text-sm text-green-700">
          Reorder from your previous purchases
        </p>
        
        {recentOrders.map((order) => (
          <div key={order.id} className="flex items-center justify-between p-3 bg-white border border-green-200 rounded-lg">
            <div>
              <p className="font-medium text-sm">#{order.orderNumber}</p>
              <p className="text-xs text-gray-600">
                {order.items.length} items • ₹{order.total.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">{order.date}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleReorder(order)}
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Reorder
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};