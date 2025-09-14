import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  Edit3,
  Plus,
  Truck,
  Star,
  Calendar,
  Phone,
  Mail,
  Home,
  Briefcase,
  MoreHorizontal,
  Check,
  X,
  Clock,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/hooks/useWishlist";
import { useToast } from "@/hooks/use-toast";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    orders,
    addresses,
    logout,
    updateProfile,
    addAddress,
  } = useAuth();
  const { addToCart } = useCart();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { toast } = useToast();

  // Real-time stats from actual orders
  const stats = {
    totalOrders: orders.length,
    todayOrders: orders.filter(order => {
      const today = new Date().toLocaleDateString();
      return order.date === today;
    }).length,
    pendingOrders: orders.filter(order => order.status === 'pending').length,
    completedOrders: orders.filter(order => order.status === 'delivered').length,
  };

  const [activeTab, setActiveTab] = useState("overview");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate("/");
  };

  const handleProfileUpdate = async () => {
    const success = await updateProfile(profileData);
    if (success) {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditingProfile(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-green-600 bg-green-50";
      case "shipped":
        return "text-blue-600 bg-blue-50";
      case "confirmed":
        return "text-orange-600 bg-orange-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <Check className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "confirmed":
        return <Clock className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <X className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "profile", label: "Profile Info", icon: User },
    { id: "addresses", label: "Address Book", icon: MapPin },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Please Login</h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to access your dashboard.
            </p>
            <Link to="/login">
              <Button className="bg-[#F9A245] hover:bg-[#e8913d] text-white">
                Go to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#F9A245] rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <nav className="space-y-2">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === item.id
                            ? "bg-[#F9A245] text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                  <Separator className="my-4" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Dashboard
                  </h1>
                  <p className="text-gray-600">
                    Welcome back, {user.firstName}!
                  </p>
                </div>

                {/* Real-time Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="relative overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Orders</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {stats.totalOrders}
                          </p>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-[#F9A245]" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Today's Orders</p>
                          <p className="text-2xl font-bold text-[#F9A245]">
                            {stats.todayOrders}
                          </p>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Clock className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Pending</p>
                          <p className="text-2xl font-bold text-yellow-600">
                            {stats.pendingOrders}
                          </p>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <Check className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Completed</p>
                          <p className="text-2xl font-bold text-green-600">
                            {stats.completedOrders}
                          </p>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Last Order Card */}
                {orders.length > 0 && (
                  <Card className="border-l-4 border-l-[#F9A245]">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Truck className="h-5 w-5 text-[#F9A245]" />
                        <span>Last Order</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2"></div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const lastOrder = orders[0];
                        return (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-gray-900">
                                  #{lastOrder.orderNumber}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {lastOrder.date}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lastOrder.status)}`}>
                                  {getStatusIcon(lastOrder.status)}
                                  <span className="capitalize">{lastOrder.status}</span>
                                </div>
                                <p className="text-lg font-bold text-[#F9A245] mt-1">
                                  ₹{lastOrder.total.toFixed(0)}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm text-gray-600">Products</p>
                                <div className="space-y-1">
                                  {lastOrder.items.map((item, idx) => (
                                    <p key={idx} className="font-medium text-sm">
                                      {item.name} {item.variant && `(${item.variant})`} × {item.quantity}
                                    </p>
                                  ))}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-600">Payment</p>
                                  <p className="font-medium capitalize">{lastOrder.paymentMethod}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">Total Items</p>
                                  <p className="font-medium">{lastOrder.items.length}</p>
                                </div>
                              </div>
                            </div>
                            {lastOrder.tracking?.trackingNumber && (
                              <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm text-blue-800">
                                    <strong>Tracking:</strong> {lastOrder.tracking.trackingNumber}
                                  </p>
                                  {lastOrder.tracking.carrier && (
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded capitalize">
                                      {lastOrder.tracking.carrier}
                                    </span>
                                  )}
                                </div>
                                {lastOrder.tracking.estimatedDelivery && (
                                  <p className="text-xs text-blue-600">
                                    Est. Delivery: {new Date(lastOrder.tracking.estimatedDelivery).toLocaleDateString()}
                                  </p>
                                )}
                                {lastOrder.tracking.trackingUrl && (
                                  <a 
                                    href={lastOrder.tracking.trackingUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                                  >
                                    Track Package
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })()
                      }
                    </CardContent>
                  </Card>
                )}

                {/* Recent Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.slice(0, 3).map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  #{order.orderNumber}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {order.date}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div
                                className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                              >
                                {getStatusIcon(order.status)}
                                <span className="capitalize">
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-gray-900 mt-1">
                                ₹{order.total.toFixed(0)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No orders yet</p>
                        <Link to="/">
                          <Button className="mt-4 bg-[#F9A245] hover:bg-[#e8913d] text-white">
                            Start Shopping
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    My Orders
                  </h1>
                  <p className="text-gray-600">Track and manage your orders</p>
                </div>

                {orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <Card key={order.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                Order #{order.orderNumber}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Placed on {order.date}
                              </p>
                            </div>
                            <div
                              className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                            >
                              {getStatusIcon(order.status)}
                              <span className="capitalize">{order.status}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center space-x-4"
                              >
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">
                                    {item.name}
                                  </h4>
                                  {item.variant && (
                                    <p className="text-sm text-gray-600">
                                      {item.variant}
                                    </p>
                                  )}
                                  <p className="text-sm text-gray-600">
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                                <p className="font-medium text-gray-900">
                                  ₹{(item.price * item.quantity).toFixed(0)}
                                </p>
                              </div>
                            ))}
                            <Separator />
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-900">
                                Total
                              </span>
                              <span className="font-bold text-xl text-[#F9A245]">
                                ₹{order.total.toFixed(0)}
                              </span>
                            </div>
                            {order.tracking?.trackingNumber && (
                              <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm text-blue-800">
                                    <strong>Tracking:</strong> {order.tracking.trackingNumber}
                                  </p>
                                  {order.tracking.carrier && (
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded capitalize">
                                      {order.tracking.carrier}
                                    </span>
                                  )}
                                </div>
                                {order.tracking.estimatedDelivery && (
                                  <p className="text-xs text-blue-600">
                                    Est. Delivery: {new Date(order.tracking.estimatedDelivery).toLocaleDateString()}
                                  </p>
                                )}
                                {order.tracking.shippedDate && (
                                  <p className="text-xs text-blue-600">
                                    Shipped: {new Date(order.tracking.shippedDate).toLocaleDateString()}
                                  </p>
                                )}
                                {order.tracking.trackingUrl && (
                                  <a 
                                    href={order.tracking.trackingUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                                  >
                                    Track Package →
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No orders yet
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Start shopping to see your orders here
                      </p>
                      <Link to="/">
                        <Button className="bg-[#F9A245] hover:bg-[#e8913d] text-white">
                          Browse Products
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    My Wishlist
                  </h1>
                  <p className="text-gray-600">Your saved favorite products</p>
                </div>

                {wishlist.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((item) => (
                      <Card key={item.id} className="group">
                        <CardContent className="p-4">
                          <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-[#F9A245] font-semibold mb-4">
                            ₹{item.price.toLocaleString()}
                          </p>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="flex-1 bg-[#F9A245] hover:bg-[#e8913d] text-white"
                              onClick={() => {
                                const cartItem = {
                                  id: parseInt(item.id),
                                  name: item.name,
                                  price: item.price,
                                  image: item.image
                                };
                                addToCart(cartItem, 1);
                                toast({
                                  title: "Added to cart",
                                  description: `${item.name} has been added to your cart.`,
                                });
                              }}
                            >
                              Add to Cart
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                removeFromWishlist(item.id);
                                toast({
                                  title: "Removed from wishlist",
                                  description: `${item.name} has been removed from your wishlist.`,
                                });
                              }}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              Remove
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Added {new Date(item.addedAt).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Your wishlist is empty
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Save products you love to your wishlist
                      </p>
                      <Link to="/">
                        <Button className="bg-[#F9A245] hover:bg-[#e8913d] text-white">
                          Discover Products
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Profile Information
                    </h1>
                    <p className="text-gray-600">
                      Manage your personal information
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    variant="outline"
                    className="border-[#F9A245] text-[#F9A245] hover:bg-[#F9A245] hover:text-white"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    {isEditingProfile ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-6">
                    {isEditingProfile ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={profileData.firstName}
                              onChange={(e) =>
                                setProfileData((prev) => ({
                                  ...prev,
                                  firstName: e.target.value,
                                }))
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={profileData.lastName}
                              onChange={(e) =>
                                setProfileData((prev) => ({
                                  ...prev,
                                  lastName: e.target.value,
                                }))
                              }
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            className="mt-1"
                          />
                        </div>
                        <div className="flex space-x-4">
                          <Button
                            onClick={handleProfileUpdate}
                            className="bg-[#F9A245] hover:bg-[#e8913d] text-white"
                          >
                            Save Changes
                          </Button>
                          <Button
                            onClick={() => setIsEditingProfile(false)}
                            variant="outline"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label className="text-gray-600">First Name</Label>
                            <p className="text-lg font-medium text-gray-900">
                              {user.firstName}
                            </p>
                          </div>
                          <div>
                            <Label className="text-gray-600">Last Name</Label>
                            <p className="text-lg font-medium text-gray-900">
                              {user.lastName}
                            </p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-gray-600">Email Address</Label>
                          <p className="text-lg font-medium text-gray-900">
                            {user.email}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Phone Number</Label>
                          <p className="text-lg font-medium text-gray-900">
                            {user.phone || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-600">Member Since</Label>
                          <p className="text-lg font-medium text-gray-900">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Address Book Tab */}
            {activeTab === "addresses" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Address Book
                  </h1>
                  <p className="text-gray-600">
                    Manage your shipping addresses
                  </p>
                </div>

                {addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                      <Card
                        key={address.id}
                        className={
                          address.isDefault ? "ring-2 ring-[#F9A245]" : ""
                        }
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-[#F9A245] rounded-full flex items-center justify-center">
                                <Home className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900 capitalize">
                                  {address.type}
                                </h3>
                                {address.isDefault && (
                                  <span className="text-xs text-[#F9A245] font-medium">
                                    Default
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p className="font-medium text-gray-900">
                              {address.firstName} {address.lastName}
                            </p>
                            <p>{address.address}</p>
                            {address.apartment && <p>{address.apartment}</p>}
                            <p>
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                            <p>{address.phone}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No addresses saved
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Add an address for faster checkout
                      </p>
                      <Button className="bg-[#F9A245] hover:bg-[#e8913d] text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Address
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Account Settings
                  </h1>
                  <p className="text-gray-600">
                    Manage your account preferences
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Email Notifications
                        </h4>
                        <p className="text-sm text-gray-600">
                          Receive order updates and promotions
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#F9A245] focus:ring-[#F9A245]"
                        defaultChecked
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          SMS Notifications
                        </h4>
                        <p className="text-sm text-gray-600">
                          Get delivery updates via SMS
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#F9A245] focus:ring-[#F9A245]"
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Marketing Emails
                        </h4>
                        <p className="text-sm text-gray-600">
                          Receive special offers and new product updates
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#F9A245] focus:ring-[#F9A245]"
                        defaultChecked
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Delete Account
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Permanently delete your account and all associated
                          data. This action cannot be undone.
                        </p>
                        <Button
                          variant="outline"
                          className="border-red-600 text-red-600 hover:bg-red-50"
                        >
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
