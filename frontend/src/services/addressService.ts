const API_URL = import.meta.env.VITE_API_ENDPOINT;

export interface Address {
  id: string;
  userId: string;
  type: "home" | "work" | "other";
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  isDefault: boolean;
}

export const addressService = {
  async getUserAddresses(userId: string): Promise<Address[]> {
    try {
      const response = await fetch(`${API_URL}/addresses/${userId}`);
      if (response.ok) {
        const data = await response.json();
        return data.addresses || [];
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      return [];
    }
  },

  async createAddress(addressData: Omit<Address, 'id'>): Promise<Address | null> {
    try {
      const response = await fetch(`${API_URL}/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.address;
      }
      return null;
    } catch (error) {
      console.error('Failed to create address:', error);
      return null;
    }
  },

  async updateAddress(id: string, addressData: Partial<Address>): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/addresses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });
      
      return response.ok;
    } catch (error) {
      console.error('Failed to update address:', error);
      return false;
    }
  },

  async deleteAddress(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/addresses/${id}`, {
        method: 'DELETE',
      });
      
      return response.ok;
    } catch (error) {
      console.error('Failed to delete address:', error);
      return false;
    }
  }
};