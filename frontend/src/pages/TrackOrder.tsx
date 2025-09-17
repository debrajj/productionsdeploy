import React, { useState } from "react";
import { Search, Package, Truck, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { orderService } from "@/services/orderService";

const TrackOrder: React.FC = () => {
  const [orderQuery, setOrderQuery] = useState("");
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Mock order data
  const mockOrderData = {
    orderNumber: "NS-ABC123DEF",
    status: "in_transit",
    estimatedDelivery: "2024-01-28",
    items: [
      {
        name: "Gold Standard 100% Whey Protein",
        quantity: 2,
        image: "/placeholder.svg",
      },
      {
        name: "Creatine Monohydrate Powder",
        quantity: 1,
        image: "/placeholder.svg",
      },
    ],
    tracking: {
      carrier: "FedEx",
      trackingNumber: "FX123456789US",
    },

  };

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    setLoading(true);

    try {
      const order = await orderService.trackOrder(orderQuery.trim());
      if (order) {
        setOrderData(order);
      } else {
        setOrderData(null);
      }
    } catch (error) {
      console.error("Error tracking order:", error);
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string, completed: boolean) => {
    if (!completed) return <Clock className="h-6 w-6 text-muted-foreground" />;

    switch (status) {
      case "confirmed":
      case "processing":
        return <CheckCircle className="h-6 w-6 text-secondary" />;
      case "shipped":
      case "in_transit":
        return <Truck className="h-6 w-6 text-primary" />;
      case "delivered":
        return <Package className="h-6 w-6 text-secondary" />;
      default:
        return <Clock className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-600 text-white";
      case "shipped":
      case "in_transit":
        return "bg-blue-600 text-white";
      case "confirmed":
      case "processing":
        return "bg-[#F9A245] text-white";
      case "pending":
        return "bg-amber-600 text-white";
      case "cancelled":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl lg:text-5xl text-foreground mb-6">
            Track Your Order
          </h1>
          <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
            Enter your order number or email to get real-time updates on your
            shipment
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 relative" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-white/95"></div>
        <div className="relative z-10">
        {/* Search Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Find Your Order</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrackOrder} className="space-y-4">
              <div>
                <Label htmlFor="orderQuery">
                  Order Number or Email Address
                </Label>
                <Input
                  id="orderQuery"
                  placeholder="e.g., NS-ABC123DEF or your@email.com"
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary-hover"
                disabled={loading}
              >
                {loading ? (
                  "Searching..."
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Track Order
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Order Results */}
        {orderData && (
          <div className="max-w-4xl mx-auto mt-12 space-y-8">
            {/* Order Header */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:space-y-0">
                  <div>
                    <CardTitle>Order #{orderData.orderNumber}</CardTitle>
                    <p className="text-muted-foreground">
                      Estimated delivery:{" "}
                      {orderData.estimatedDelivery
                        ? new Date(
                            orderData.estimatedDelivery
                          ).toLocaleDateString()
                        : "Calculating..."}
                    </p>
                  </div>
                  <Badge className={getStatusColor(orderData.status || 'pending')}>
                    {orderData.status?.replace("_", " ").toUpperCase() ||
                      "PENDING"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Items */}
                  <div>
                    <h3 className="font-semibold mb-4">Items in this order</h3>
                    <div className="space-y-3">
                      {Array.isArray(orderData.items) && orderData.items.length > 0 ? (
                        orderData.items.map((item: any, index: number) => (
                          <div
                            key={item.id || index}
                            className="flex items-center space-x-3"
                          >
                            <div className="w-12 h-12 bg-[#F9A245] rounded flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {(item.name || 'P').charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {item.name || 'Unnamed Product'}
                              </p>
                              {(item.selectedFlavor || item.selectedWeight || item.variant) && (
                                <p className="text-[#F9A245] text-xs">
                                  {item.selectedFlavor && `Flavor: ${item.selectedFlavor}`}
                                  {item.selectedFlavor && item.selectedWeight && ' • '}
                                  {item.selectedWeight && `Weight: ${item.selectedWeight}`}
                                  {!item.selectedFlavor && !item.selectedWeight && item.variant && item.variant}
                                </p>
                              )}
                              <div className="flex justify-between items-center">
                                <p className="text-muted-foreground text-sm">
                                  Qty: {item.quantity || 1}
                                </p>
                                <p className="font-medium text-sm">
                                  ₹{(item.price || 0).toLocaleString()}
                                </p>
                              </div>
                              {item.sku && (
                                <p className="text-xs text-muted-foreground">
                                  SKU: {item.sku}
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          No items found in this order.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Tracking Info */}
                  <div>
                    <h3 className="font-semibold mb-4">Tracking Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Carrier:</span>
                        <span className="font-medium">
                          {orderData.tracking.carrier}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Tracking #:
                        </span>
                        <span className="font-medium">
                          {orderData.tracking.trackingNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>


          </div>
        )}

        {orderData === null && orderQuery && !loading && (
          <Card className="max-w-2xl mx-auto mt-8">
            <CardContent className="p-8 text-center">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">Order Not Found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find an order with that number or email address.
                Please check your information and try again.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  • Make sure you entered the correct order number (e.g.,
                  NS-ABC123DEF)
                </p>
                <p>• Check that you used the email address from your order</p>
                <p>
                  • Orders may take a few minutes to appear in our system after
                  purchase
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <div className="max-w-2xl mx-auto mt-12">
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
              <p className="text-muted-foreground mb-4">
                Can't find your order or have questions about shipping?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline">Contact Support</Button>
                <Button variant="outline">Call: (555) 123-4567</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
