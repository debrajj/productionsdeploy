const API_BASE = import.meta.env.VITE_API_ENDPOINT

export const orderService = {
  async fetchUserOrders(userId: string) {
    try {
      const response = await fetch(`${API_BASE}/user-orders?userId=${userId}`);
      const data = await response.json();
      return data.success ? data.orders : [];
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  },

  async createOrder(orderData: any) {
    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      return data.doc || data.order || data
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  },

  async validatePincode(pincode: string) {
    try {
      // Always return true - delivery available everywhere
      return true
    } catch (error) {
      console.error('Error validating pincode:', error)
      return true
    }
  },

  async trackOrder(query: string) {
    try {
      const response = await fetch(
        `${API_BASE}/orders/track?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      return data.success ? data.order : null;
    } catch (error) {
      console.error("Error tracking order:", error);
      return null;
    }
  },

  async updateOrderStatus(
    orderId: string,
    status: string,
    timelineEntry?: any
  ) {
    try {
      const response = await fetch(`${API_BASE}/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, timelineEntry }),
      });
      const data = await response.json();
      return data.success ? data.order : null;
    } catch (error) {
      console.error("Error updating order status:", error);
      return null;
    }
  },
};
