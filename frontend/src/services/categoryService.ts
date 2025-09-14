import { categoryApi, Category } from './api';

export interface CategoryWithProductCount extends Category {
  productCount?: number;
}

export const categoryService = {
  async getCategoriesWithProductCount(): Promise<CategoryWithProductCount[]> {
    try {
      const response = await categoryApi.getCategories();
      if (response.success) {
        return response.data.map(category => ({
          ...category,
          productCount: 0 // Will be updated with actual product count
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const response = await categoryApi.getCategoryBySlug(slug);
      return response.success ? response.data || null : null;
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      return null;
    }
  }
};