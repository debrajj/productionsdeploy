'use client'
import React, { useState, useEffect } from 'react'

interface SalesData {
  totalSales: number
  totalOrders: number
  totalProducts: number
  totalStock: number
  orders: any[]
  products: any[]
}

const SalesAnalytics: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesData>({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalStock: 0,
    orders: [],
    products: []
  })
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSalesData()
  }, [filter])

  const fetchSalesData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/sales-analytics?filter=${filter}`)
      const data = await response.json()
      
      setSalesData(data)
    } catch (error) {
      console.error('Error fetching sales data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterOrdersByDate = (orders: any[], period: string) => {
    const now = new Date()
    const startDate = new Date()
    
    switch (period) {
      case 'day':
        startDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      default:
        return orders
    }
    
    return orders.filter((order: any) => new Date(order.orderDate) >= startDate)
  }

  if (loading) {
    return <div className="p-6">Loading analytics...</div>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Sales Analytics</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Filter by:</label>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All Time</option>
          <option value="day">Today</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Total Sales</h3>
          <p className="text-2xl font-bold text-blue-600">₹{salesData.totalSales.toLocaleString()}</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Total Orders</h3>
          <p className="text-2xl font-bold text-green-600">{salesData.totalOrders}</p>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800">Total Products</h3>
          <p className="text-2xl font-bold text-purple-600">{salesData.totalProducts}</p>
        </div>
        
        <div className="bg-orange-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-800">Total Stock</h3>
          <p className="text-2xl font-bold text-orange-600">{salesData.totalStock}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Order #</th>
                  <th className="text-left p-2">Customer</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {salesData.orders.slice(0, 10).map((order: any) => (
                  <tr key={order.id} className="border-b">
                    <td className="p-2">{order.orderNumber}</td>
                    <td className="p-2">{order.customerName}</td>
                    <td className="p-2">₹{order.totalAmount}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Product Stock Status</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Product</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Stock</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {salesData.products.slice(0, 10).map((product: any) => (
                  <tr key={product.id} className="border-b">
                    <td className="p-2">{product.name}</td>
                    <td className="p-2">₹{product.price}</td>
                    <td className="p-2">{product.stock || 0}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        (product.stock || 0) > 10 ? 'bg-green-100 text-green-800' :
                        (product.stock || 0) > 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {(product.stock || 0) > 10 ? 'In Stock' :
                         (product.stock || 0) > 0 ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesAnalytics