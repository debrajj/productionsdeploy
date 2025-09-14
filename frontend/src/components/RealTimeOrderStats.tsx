import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Clock, CheckCircle, Truck, TrendingUp } from 'lucide-react';

interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  lastOrderStatus: string;
  todayOrders: number;
}

const RealTimeOrderStats: React.FC = () => {
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    lastOrderStatus: 'none',
    todayOrders: 0,
  });

  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalOrders: prev.totalOrders + Math.floor(Math.random() * 2),
        todayOrders: prev.todayOrders + Math.floor(Math.random() * 2),
        pendingOrders: Math.max(0, prev.pendingOrders + Math.floor(Math.random() * 3) - 1),
        completedOrders: prev.completedOrders + Math.floor(Math.random() * 2),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="relative overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          {isLive && (
            <div className="absolute top-2 right-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Orders</p>
              <p className="text-2xl font-bold text-[#F9A245]">{stats.todayOrders}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-[#F9A245]" />
            </div>
          </div>
          {isLive && (
            <div className="absolute top-2 right-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          {isLive && (
            <div className="absolute top-2 right-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completedOrders}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          {isLive && (
            <div className="absolute top-2 right-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeOrderStats;