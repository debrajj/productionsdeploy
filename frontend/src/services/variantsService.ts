const API_BASE = import.meta.env.VITE_API_ENDPOINT;

export interface ProductVariants {
  flavors: string[];
  weights: string[];
}

export const fetchProductVariants = async (): Promise<ProductVariants> => {
  const response = await fetch(`${API_BASE}/product-variants`);
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch variants');
  }
  
  return result.data;
};