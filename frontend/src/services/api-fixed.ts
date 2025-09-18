import { API_CONFIG, getImageUrl } from '../config/api';

const PAYLOAD_API_BASE = API_CONFIG.BASE_URL;

// Utility function to parse variants with multiple fallback strategies
const parseVariants = (variants: any) => {
  try {
    if (typeof variants === 'string') {
      let variantStr = variants;
      
      // Decode HTML entities first
      variantStr = variantStr.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
      
      if (variantStr && variantStr !== '[]') {
        try {
          // Try parsing as-is first
          return JSON.parse(variantStr) || [];
        } catch {
          // If that fails, try fixing unquoted JSON
          const fixedStr = variantStr
            .replace(/([{,])\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
            .replace(/:([^,}[\]"]+)([,}])/g, ':"$1"$2')
            .replace(/:"(\d+)"([,}])/g, ':$1$2');
          
          return JSON.parse(fixedStr) || [];
        }
      }
      return [];
    }
    return variants || [];
  } catch (e) {
    console.log('Variant parsing error:', e.message, 'for:', variants);
    return [];
  }
};

export interface Product {
  id: string;
  name: string;
  slug: string;
  image: string;
  images?: { url: string }[];
  rating?: number;
  reviews?: number;
  price: number;
  originalPrice?: number;
  onSale?: boolean;
  category: string;
  categorySlug?: string;
  subcategory?: string;
  subcategorySlug?: string;
  customCategory?: string;
  customSubcategory?: string;
  brand: string;
  customBrand?: string;
  featured?: boolean;
  trending?: boolean;
  bestSeller?: boolean;
  lovedByExperts?: boolean;
  shopByGoal?: string;
  description?: string;
  certifications?: { name: string }[];
  nutritionInfo?: {
    servingSize?: string;
    servingsPerContainer?: number;
    protein?: string;
    carbohydrates?: string;
    fat?: string;
    calories?: number;
    sodium?: string;
    calcium?: string;
  };
  nutritionImage?: string;
  ingredients?: { name: string }[];
  subscriptionOptions?: {
    available?: boolean;
    discounts?: {
      monthly?: number;
      quarterly?: number;
      biannual?: number;
    };
  };
  variants?: {
    flavor?: string;
    weight?: string;
    price?: number;
  }[];
  simpleFlavors?: string;
  bundledOffers?: any[];
  upsells?: Array<{
    upsellProduct: Product;
    discountPercentage: number;
    description: string;
    active: boolean;
  }>;
  inStock?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination?: {
    page: number;
    totalPages: number;
    totalDocs: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  featured?: boolean;
  trending?: boolean;
  bestSeller?: boolean;
  lovedByExperts?: boolean;
  onSale?: boolean;
  shopByGoal?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const productApi = {
  async getProducts(
    filters: ProductFilters = {}
  ): Promise<ProductsResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.subcategory) params.append('subcategory', filters.subcategory);
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.featured) params.append('featured', 'true');
      if (filters.trending) params.append('trending', 'true');
      if (filters.bestSeller) params.append('bestSeller', 'true');
      if (filters.lovedByExperts) params.append('lovedByExperts', 'true');
      if (filters.onSale) params.append('onSale', 'true');
      if (filters.shopByGoal) params.append('shopByGoal', filters.shopByGoal);
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());

      const response = await fetch(`${PAYLOAD_API_BASE}/products?${params.toString()}`);
      
      if (!response.ok) {
        return {
          success: false,
          data: [],
          pagination: {
            page: 1,
            totalPages: 0,
            totalDocs: 0,
            hasNextPage: false,
            hasPrevPage: false
          }
        };
      }

      const data = await response.json();
      
      const transformedProducts = data.docs?.map((product: any) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: typeof product.image === 'string' && product.image.startsWith('/') 
          ? getImageUrl(product.image) 
          : (typeof product.image === 'string' ? product.image : null),
        images: (() => {
          try {
            if (typeof product.images === 'string') {
              try {
                const parsedImages = JSON.parse(product.images)
                return Array.isArray(parsedImages) ? parsedImages.map((url: string) => ({
                  url: url && url.startsWith('/') ? getImageUrl(url) : url,
                  imageType: 'url'
                })) : []
              } catch {
                if (product.images.trim()) {
                  return product.images.split(',').map((url: string) => ({
                    url: url.trim() && url.trim().startsWith('/') ? getImageUrl(url.trim()) : url.trim(),
                    imageType: 'url'
                  })).filter(img => img.url)
                }
                return []
              }
            }
            return product.images?.map((img: any) => ({
              url: img.url && img.url.startsWith('/') ? getImageUrl(img.url) : img.url,
              imageType: img.imageType
            })) || []
          } catch (e) {
            return []
          }
        })(),
        rating: product.rating,
        reviews: product.reviews,
        price: product.price,
        originalPrice: product.originalPrice,
        onSale: product.onSale,
        category: product.category,
        subcategory: product.subcategory,
        brand: product.brand,
        featured: product.featured,
        trending: product.trending,
        bestSeller: product.bestSeller,
        lovedByExperts: product.lovedByExperts,
        shopByGoal: product.shopByGoal,
        description: product.description,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      })) || [];

      return {
        success: true,
        data: transformedProducts,
        pagination: {
          page: data.page || 1,
          totalPages: data.totalPages || 0,
          totalDocs: data.totalDocs || 0,
          hasNextPage: data.hasNextPage || false,
          hasPrevPage: data.hasPrevPage || false
        }
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        pagination: {
          page: 1,
          totalPages: 0,
          totalDocs: 0,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    }
  },

  async getProductById(
    id: string
  ): Promise<{ success: boolean; data?: Product; error?: string }> {
    try {
      const response = await fetch(`${PAYLOAD_API_BASE}/products/${id}?depth=2`);

      if (!response.ok) {
        return {
          success: false,
          error: `Failed to fetch product: ${response.status} ${response.statusText}`,
        };
      }

      const data = await response.json();

      const transformedProduct = {
        id: data.id,
        name: data.name,
        slug: data.slug,
        image: typeof data.image === 'string' && data.image.startsWith('/') 
          ? getImageUrl(data.image) 
          : (typeof data.image === 'string' ? data.image : null),
        images: (() => {
          try {
            if (typeof data.images === 'string') {
              // First try to parse as JSON
              try {
                const parsedImages = JSON.parse(data.images)
                return Array.isArray(parsedImages) ? parsedImages.map((url: string) => ({
                  url: url && url.startsWith('/') ? getImageUrl(url) : url,
                  imageType: 'url'
                })) : []
              } catch {
                // If JSON parsing fails, treat as comma-separated URLs
                if (data.images.trim()) {
                  return data.images.split(',').map((url: string) => ({
                    url: url.trim() && url.trim().startsWith('/') ? getImageUrl(url.trim()) : url.trim(),
                    imageType: 'url'
                  })).filter(img => img.url) // Remove empty URLs
                }
                return []
              }
            }
            return data.images?.map((img: any) => ({
              url: img.url && img.url.startsWith('/') ? getImageUrl(img.url) : img.url,
              imageType: img.imageType
            })) || []
          } catch (e) {
            return []
          }
        })(),
        rating: data.rating,
        reviews: data.reviews,
        price: data.price,
        originalPrice: data.originalPrice,
        onSale: data.onSale,
        category: data.category,
        subcategory: data.subcategory,
        customCategory: data.customCategory,
        customSubcategory: data.customSubcategory,
        brand: data.brand,
        customBrand: data.customBrand,
        featured: data.featured,
        trending: data.trending,
        bestSeller: data.bestSeller,
        lovedByExperts: data.lovedByExperts,
        shopByGoal: data.shopByGoal,
        description: data.description,
        certifications: (() => {
          try {
            if (typeof data.certifications === 'string') {
              return JSON.parse(data.certifications) || []
            }
            return data.certifications || []
          } catch (e) {
            return []
          }
        })(),
        nutritionInfo: typeof data.nutritionInfo === 'string' ? data.nutritionInfo : (data.nutritionInfo || {}),
        nutritionImage: data.nutritionImage && data.nutritionImage.startsWith('/') 
          ? getImageUrl(data.nutritionImage) 
          : data.nutritionImage,
        ingredients: data.ingredients || [],
        subscriptionOptions: data.subscriptionOptions || {},
        variants: parseVariants(data.variants),
        simpleFlavors: data.simpleFlavors,
        simpleWeights: data.simpleWeights,
        bundledOffers: data.bundledOffers || [],
        upsells: data.upsells || [],
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };

      return {
        success: true,
        data: transformedProduct,
      };
    } catch (error) {
      return {
        success: false,
        error: "Network error while fetching product",
      };
    }
  },

  async getProductBySlug(
    slug: string
  ): Promise<{ success: boolean; data?: Product; error?: string }> {
    try {
      const response = await fetch(`${PAYLOAD_API_BASE}/products?where[slug][equals]=${slug}&depth=2&limit=1`);
      
      if (!response.ok) {
        return {
          success: false,
          error: `Failed to fetch product: ${response.status}`,
        };
      }

      const data = await response.json();
      const product = data.docs?.[0];

      if (!product) {
        return {
          success: false,
          error: "Product not found",
        };
      }

      const transformedProduct = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: typeof product.image === 'string' && product.image.startsWith('/') 
          ? getImageUrl(product.image) 
          : (typeof product.image === 'string' ? product.image : null),
        images: (() => {
          try {
            if (typeof product.images === 'string') {
              // First try to parse as JSON
              try {
                const parsedImages = JSON.parse(product.images)
                return Array.isArray(parsedImages) ? parsedImages.map((url: string) => ({
                  url: url && url.startsWith('/') ? getImageUrl(url) : url,
                  imageType: 'url'
                })) : []
              } catch {
                // If JSON parsing fails, treat as comma-separated URLs
                if (product.images.trim()) {
                  return product.images.split(',').map((url: string) => ({
                    url: url.trim() && url.trim().startsWith('/') ? getImageUrl(url.trim()) : url.trim(),
                    imageType: 'url'
                  })).filter(img => img.url) // Remove empty URLs
                }
                return []
              }
            }
            return product.images?.map((img: any) => ({
              url: img.url && img.url.startsWith('/') ? getImageUrl(img.url) : img.url,
              imageType: img.imageType
            })) || []
          } catch (e) {
            return []
          }
        })(),
        rating: product.rating,
        reviews: product.reviews,
        price: product.price,
        originalPrice: product.originalPrice,
        onSale: product.onSale,
        category: product.category,
        subcategory: product.subcategory,
        customCategory: product.customCategory,
        customSubcategory: product.customSubcategory,
        brand: product.brand,
        customBrand: product.customBrand,
        featured: product.featured,
        trending: product.trending,
        bestSeller: product.bestSeller,
        lovedByExperts: product.lovedByExperts,
        shopByGoal: product.shopByGoal,
        description: product.description,
        certifications: (() => {
          try {
            if (typeof product.certifications === 'string') {
              return JSON.parse(product.certifications) || []
            }
            return product.certifications || []
          } catch (e) {
            return []
          }
        })(),
        nutritionInfo: typeof product.nutritionInfo === 'string' ? product.nutritionInfo : (product.nutritionInfo || {}),
        nutritionImage: product.nutritionImage && product.nutritionImage.startsWith('/') 
          ? getImageUrl(product.nutritionImage) 
          : product.nutritionImage,
        ingredients: (() => {
          try {
            if (typeof product.ingredients === 'string') {
              return product.ingredients.split(',').map((ingredient: string) => ({
                name: ingredient.trim()
              }))
            }
            return product.ingredients || []
          } catch (e) {
            return []
          }
        })(),
        subscriptionOptions: product.subscriptionOptions || {},
        variants: parseVariants(product.variants),
        simpleFlavors: product.simpleFlavors,
        simpleWeights: product.simpleWeights,
        bundledOffers: product.bundledOffers || [],
        upsells: product.upsells || [],
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      };

      return {
        success: true,
        data: transformedProduct,
      };
    } catch (error) {
      return {
        success: false,
        error: "Network error while fetching product",
      };
    }
  },
};