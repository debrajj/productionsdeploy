import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Truck, Clock, CheckCircle, MapPin, Phone, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const LastOrderCard: React.FC = () => {
  const { orders } = useAuth();
  const [lastOrder, setLastOrder] = useState<any>(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (orders.length > 0) {
      // Get the most recent order
      const sortedOrders = [...orders].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setLastOrder(sortedOrders[0]);
    }
  }, [orders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-50 border-green-200';
      case 'shipped': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'confirmed': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'confirmed': return <Package className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const handleTrackOrder = () => {
    setIsTracking(true);
    // Simulate tracking
    setTimeout(() => setIsTracking(false), 2000);
  };

  if (!lastOrder) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Orders</h3>
          <p className="text-gray-600">Your recent orders will appear here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Last Order</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Header */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-semibold text-gray-900">#{lastOrder.orderNumber}</h4>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {lastOrder.date}
            </p>
          </div>
          <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(lastOrder.status)}`}>
            {getStatusIcon(lastOrder.status)}
            <span className="capitalize">{lastOrder.status}</span>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-2">
          <h5 className="font-medium text-gray-900">Items ({lastOrder.items.length})</h5>
          {lastOrder.items.slice(0, 2).map((item: any, index: number) => (
            <div key={index} className="flex items-center space-x-3 p-2 bg-white border rounded-lg">
              <img
                src={item.image || '/placeholder.svg'}
                alt={item.name}
                className="w-10 h-10 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium text-gray-900">₹{item.price}</p>
            </div>
          ))}
          {lastOrder.items.length > 2 && (
            <p className="text-xs text-gray-500 text-center">
              +{lastOrder.items.length - 2} more items
            </p>
          )}
        </div>

        {/* Order Total */}
        <div className="flex justify-between items-center p-3 bg-[#F9A245]/10 rounded-lg border border-[#F9A245]/20">
          <span className="font-medium text-gray-900">Total Amount</span>
          <span className="font-bold text-xl text-[#F9A245]">₹{lastOrder.total}</span>
        </div>

        {/* Tracking Info */}
        {lastOrder.trackingNumber && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">Tracking Number</p>
                <p className="text-sm text-blue-700">{lastOrder.trackingNumber}</p>
              </div>
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            onClick={handleTrackOrder}
            disabled={isTracking}
            className="flex-1 bg-[#F9A245] hover:bg-[#e8913d] text-white"
            size="sm"
          >
            {isTracking ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Tracking...
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 mr-2" />
                Track Order
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Phone className="h-4 w-4 mr-2" />
            Support
          </Button>
        </div>

        {/* Live Updates Indicator */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            Updates every 30 seconds • Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LastOrderCard;