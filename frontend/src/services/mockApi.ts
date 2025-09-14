import productsData from '@/assets/products-with-upsells.json';

export interface MockProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  brand: string;
  category: string;
  onSale?: boolean;
  upsells?: Array<{
    upsellProduct: MockProduct;
    discountPercentage: number;
    description: string;
    active: boolean;
  }>;
}

export const mockProductApi = {
  async getProductById(id: string): Promise<{ success: boolean; data?: MockProduct; error?: string }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const product = productsData.products.find(p => p.id === id);
      
      if (!product) {
        return {
          success: false,
          error: 'Product not found'
        };
      }
      
      return {
        success: true,
        data: product as MockProduct
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch product'
      };
    }
  },

  async getProductsByCategory(category: string, limit: number = 10): Promise<{ success: boolean; data: MockProduct[] }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const filteredProducts = productsData.products
        .filter(p => p.category === category)
        .slice(0, limit);
      
      return {
        success: true,
        data: filteredProducts as MockProduct[]
      };
    } catch (error) {
      return {
        success: false,
        data: []
      };
    }
  }
};