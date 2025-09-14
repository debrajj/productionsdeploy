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
    timeline: [
      {
        status: "confirmed",
        title: "Order Confirmed",
        description: "Your order has been confirmed and is being prepared.",
        date: "2024-01-25",
        completed: true,
      },
      {
        status: "processing",
        title: "Processing",
        description: "Your order is being prepared for shipment.",
        date: "2024-01-25",
        completed: true,
      },
      {
        status: "shipped",
        title: "Shipped",
        description: "Your order has been shipped and is on its way.",
        date: "2024-01-26",
        completed: true,
      },
      {
        status: "in_transit",
        title: "In Transit",
        description: "Your package is currently in transit to your address.",
        date: "2024-01-27",
        completed: true,
      },
      {
        status: "delivered",
        title: "Delivered",
        description: "Your order has been delivered.",
        date: "2024-01-28",
        completed: false,
      },
    ],
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
      case "confirmed":
        return "bg-blue-500";
      case "processing":
        return "bg-yellow-500";
      case "shipped":
        return "bg-orange-500";
      case "in_transit":
        return "bg-primary";
      case "delivered":
        return "bg-secondary";
      default:
        return "bg-muted-foreground";
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

      <div className="container mx-auto px-4">
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
                  <Badge className="bg-primary text-primary-foreground">
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
                            <img
                              src={item.image || '/placeholder-product.jpg'}
                              alt={item.name || 'Product'}
                              className="w-12 h-12 object-cover rounded"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-product.jpg';
                              }}
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {item.name || 'Unnamed Product'}
                                {item.variant && (
                                  <span className="text-muted-foreground text-xs ml-2">
                                    ({item.variant})
                                  </span>
                                )}
                              </p>
                              <div className="flex justify-between items-center">
                                <p className="text-muted-foreground text-sm">
                                  Qty: {item.quantity || 1}
                                </p>
                                <p className="font-medium text-sm">
                                  ${(item.price || 0).toFixed(2)}
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

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {orderData.timeline?.map((step: any, index: number) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div
                        className={`w-3 h-3 rounded-full mt-2 ${
                          step.completed
                            ? getStatusColor(step.status)
                            : "bg-muted-foreground"
                        }`}
                      />

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(step.status, step.completed)}
                          <h3
                            className={`font-semibold ${
                              step.completed
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {step.title}
                          </h3>
                          <span className="text-sm text-muted-foreground">
                            {step.timestamp
                              ? new Date(step.timestamp).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                        <p
                          className={`text-sm ${
                            step.completed
                              ? "text-muted-foreground"
                              : "text-muted-foreground/70"
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="h-12 w-12 mx-auto mb-4" />
                      <p>
                        Timeline information will be updated as your order
                        progresses.
                      </p>
                    </div>
                  )}
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
  );
};

export default TrackOrder;
