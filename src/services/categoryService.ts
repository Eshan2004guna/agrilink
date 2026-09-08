import { Category } from '../types';
import { getStoredData, setStoredData, STORAGE_KEYS } from '../utils/storage';

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return getStoredData<Category[]>(STORAGE_KEYS.CATEGORIES, []);
  },

  async createCategory(name: string, description: string, iconName?: string): Promise<Category> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const categories = getStoredData<Category[]>(STORAGE_KEYS.CATEGORIES, []);
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name,
      description,
      iconName: iconName || 'Leaf',
      productCount: 0,
    };
    categories.push(newCat);
    setStoredData(STORAGE_KEYS.CATEGORIES, categories);
    return newCat;
  },

  async updateCategory(id: string, name: string, description: string): Promise<Category> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const categories = getStoredData<Category[]>(STORAGE_KEYS.CATEGORIES, []);
    const idx = categories.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Category not found');

    categories[idx] = { ...categories[idx], name, description };
    setStoredData(STORAGE_KEYS.CATEGORIES, categories);
    return categories[idx];
  },

  async deleteCategory(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let categories = getStoredData<Category[]>(STORAGE_KEYS.CATEGORIES, []);
    categories = categories.filter((c) => c.id !== id);
    setStoredData(STORAGE_KEYS.CATEGORIES, categories);
  }
};
