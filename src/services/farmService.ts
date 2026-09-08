import { Farm, LandSizeUnit } from '../types';
import { getStoredData, setStoredData, STORAGE_KEYS } from '../utils/storage';

export const farmService = {
  async getFarms(farmerId?: string): Promise<Farm[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const farms = getStoredData<Farm[]>(STORAGE_KEYS.FARMS, []);
    if (farmerId) {
      return farms.filter((f) => f.farmerId === farmerId);
    }
    return farms;
  },

  async getFarmById(id: string): Promise<Farm | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const farms = getStoredData<Farm[]>(STORAGE_KEYS.FARMS, []);
    return farms.find((f) => f.id === id) || null;
  },

  async createFarm(data: {
    name: string;
    description: string;
    district: string;
    city: string;
    address: string;
    landSize: number;
    landSizeUnit: LandSizeUnit;
    imageUrl?: string;
    farmerId: string;
    farmerName: string;
  }): Promise<Farm> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const farms = getStoredData<Farm[]>(STORAGE_KEYS.FARMS, []);
    const newFarm: Farm = {
      id: `farm-${Date.now()}`,
      name: data.name,
      description: data.description,
      district: data.district,
      city: data.city,
      address: data.address,
      landSize: data.landSize,
      landSizeUnit: data.landSizeUnit,
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
      farmerId: data.farmerId,
      farmerName: data.farmerName,
      cropCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    farms.unshift(newFarm);
    setStoredData(STORAGE_KEYS.FARMS, farms);
    return newFarm;
  },

  async updateFarm(id: string, updates: Partial<Farm>): Promise<Farm> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const farms = getStoredData<Farm[]>(STORAGE_KEYS.FARMS, []);
    const idx = farms.findIndex((f) => f.id === id);
    if (idx === -1) throw new Error('Farm not found');

    const updated = { ...farms[idx], ...updates };
    farms[idx] = updated;
    setStoredData(STORAGE_KEYS.FARMS, farms);
    return updated;
  },

  async deleteFarm(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let farms = getStoredData<Farm[]>(STORAGE_KEYS.FARMS, []);
    farms = farms.filter((f) => f.id !== id);
    setStoredData(STORAGE_KEYS.FARMS, farms);
  }
};
