import { Product, ProductStatus } from '../types';
import { getStoredData, setStoredData, STORAGE_KEYS } from '../utils/storage';

export const productService = {
  async getProducts(params?: {
    search?: string;
    category?: string;
    district?: string;
    minPrice?: number;
    maxPrice?: number;
    farmerId?: string;
    sort?: string;
    isFeatured?: boolean;
  }): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    let products = getStoredData<Product[]>(STORAGE_KEYS.PRODUCTS, []);

    if (params?.farmerId) {
      products = products.filter((p) => p.farmerId === params.farmerId);
    }
    if (params?.category && params.category !== 'All') {
      products = products.filter((p) => p.category.toLowerCase() === params.category!.toLowerCase());
    }
    if (params?.district && params.district !== 'All') {
      products = products.filter((p) => p.district.toLowerCase() === params.district!.toLowerCase());
    }
    if (params?.search) {
      const query = params.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.farmerName.toLowerCase().includes(query) ||
          p.district.toLowerCase().includes(query)
      );
    }
    if (params?.minPrice !== undefined) {
      products = products.filter((p) => p.price >= params.minPrice!);
    }
    if (params?.maxPrice !== undefined) {
      products = products.filter((p) => p.price <= params.maxPrice!);
    }
    if (params?.isFeatured) {
      products = products.filter((p) => p.isFeatured);
    }

    if (params?.sort) {
      if (params.sort === 'price-low') products.sort((a, b) => a.price - b.price);
      if (params.sort === 'price-high') products.sort((a, b) => b.price - a.price);
      if (params.sort === 'newest') products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (params.sort === 'name') products.sort((a, b) => a.name.localeCompare(b.name));
    }

    return products;
  },

  async getProductById(id: string): Promise<Product | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const products = getStoredData<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    return products.find((p) => p.id === id) || null;
  },

  async createProduct(data: {
    name: string;
    description: string;
    category: string;
    price: number;
    availableQuantity: number;
    unit: string;
    farmId: string;
    farmerId: string;
    farmerName: string;
    imageUrls?: string[];
  }): Promise<Product> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const products = getStoredData<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    const farms = getStoredData<any[]>(STORAGE_KEYS.FARMS, []);
    const farm = farms.find((f) => f.id === data.farmId);

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: data.name,
      description: data.description,
      category: data.category,
      price: data.price,
      availableQuantity: data.availableQuantity,
      unit: data.unit,
      farmId: data.farmId,
      farmName: farm ? farm.name : 'Highland Farm',
      farmerId: data.farmerId,
      farmerName: data.farmerName,
      district: farm ? farm.district : 'Nuwara Eliya',
      location: farm ? `${farm.city}, ${farm.district}` : 'Nuwara Eliya',
      imageUrls: data.imageUrls?.length ? data.imageUrls : ['https://images.unsplash.com/photo-1598170845058-12ef4a457939?auto=format&fit=crop&q=80&w=800'],
      status: 'AVAILABLE',
      rating: 5.0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    products.unshift(newProduct);
    setStoredData(STORAGE_KEYS.PRODUCTS, products);
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const products = getStoredData<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Product not found');

    const updated = { ...products[idx], ...updates };
    products[idx] = updated;
    setStoredData(STORAGE_KEYS.PRODUCTS, products);
    return updated;
  },

  async deleteProduct(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let products = getStoredData<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    products = products.filter((p) => p.id !== id);
    setStoredData(STORAGE_KEYS.PRODUCTS, products);
  }
};
