import { useState, useEffect } from 'react'
import { productApi, categoryApi, Product, Category } from '../services/api'

interface OrganizedProducts {
  [categoryName: string]: {
    totalProducts: number;
    products: {
      [subcategoryName: string]: Product[];
    };
  };
}

interface ProductsData {
  organizedProducts: OrganizedProducts;
  statistics: {
    totalProducts: number;
    totalCategories: number;
    totalBrands: number;
  };
}

export const useApiData = () => {
  const [products, setProducts] = useState<ProductsData>({
    organizedProducts: {},
    statistics: { totalProducts: 0, totalCategories: 0, totalBrands: 0 }
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Fetch both in parallel
        const [productsResponse, categoriesResponse] = await Promise.all([
          productApi.getAllProducts(),
          categoryApi.getCategories()
        ])

        if (productsResponse.success && productsResponse.data) {
          // Organize products by category and subcategory
          const organizedProducts: OrganizedProducts = {}
          const brands = new Set<string>()
          
          productsResponse.data.forEach((product: Product) => {
            const category = product.customCategory || product.category || 'Uncategorized'
            const subcategory = product.customSubcategory || product.subcategory || 'General'
            
            if (!organizedProducts[category]) {
              organizedProducts[category] = {
                totalProducts: 0,
                products: {}
              }
            }
            
            if (!organizedProducts[category].products[subcategory]) {
              organizedProducts[category].products[subcategory] = []
            }
            
            organizedProducts[category].products[subcategory].push(product)
            organizedProducts[category].totalProducts++
            
            if (product.customBrand || product.brand) {
              brands.add(product.customBrand || product.brand)
            }
          })
          
          setProducts({
            organizedProducts,
            statistics: {
              totalProducts: productsResponse.data.length,
              totalCategories: Object.keys(organizedProducts).length,
              totalBrands: brands.size
            }
          })
        }
        
        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data)
        }
        
        // Only set error if both fail
        if (!productsResponse.success && !categoriesResponse.success) {
          setError('API temporarily unavailable')
        }
      } catch (err) {
        console.warn('Error loading data:', err)
        setError('Backend may not be running')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return { products, categories, loading, error }
}