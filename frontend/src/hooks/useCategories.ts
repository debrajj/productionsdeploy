import { useState, useEffect } from 'react'
import { fetchCategories, fetchBrands, Category, Brand } from '../services/api'

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetchCategories()
        
        if (response.success) {
          setCategories(response.data)
        } else {
          setError(response.error || 'Failed to fetch categories')
        }
      } catch (err) {
        setError('Error loading categories')
        console.error('Error loading categories:', err)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  return { categories, loading, error }
}

export const useBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBrands = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetchBrands()
        
        if (response.success) {
          setBrands(response.data)
        } else {
          setError(response.error || 'Failed to fetch brands')
        }
      } catch (err) {
        setError('Error loading brands')
        console.error('Error loading brands:', err)
      } finally {
        setLoading(false)
      }
    }

    loadBrands()
  }, [])

  return { brands, loading, error }
}