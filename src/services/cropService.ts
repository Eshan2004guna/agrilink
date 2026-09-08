import { Crop, CropStatus } from '../types';
import { getStoredData, setStoredData, STORAGE_KEYS } from '../utils/storage';

export const cropService = {
  async getCrops(farmerId?: string, farmId?: string): Promise<Crop[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    let crops = getStoredData<Crop[]>(STORAGE_KEYS.CROPS, []);
    if (farmerId) {
      crops = crops.filter((c) => c.farmerId === farmerId);
    }
    if (farmId) {
      crops = crops.filter((c) => c.farmId === farmId);
    }
    return crops;
  },

  async getCropById(id: string): Promise<Crop | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const crops = getStoredData<Crop[]>(STORAGE_KEYS.CROPS, []);
    return crops.find((c) => c.id === id) || null;
  },

  async createCrop(data: {
    cropName: string;
    farmId: string;
    farmName: string;
    farmerId: string;
    category: string;
    plantingDate: string;
    expectedHarvestDate: string;
    quantity: number;
    unit: string;
    status: CropStatus;
    notes?: string;
  }): Promise<Crop> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const crops = getStoredData<Crop[]>(STORAGE_KEYS.CROPS, []);
    const newCrop: Crop = {
      id: `crop-${Date.now()}`,
      ...data,
    };
    crops.unshift(newCrop);
    setStoredData(STORAGE_KEYS.CROPS, crops);

    // Update farm's crop count
    const farms = getStoredData<any[]>(STORAGE_KEYS.FARMS, []);
    const farmIdx = farms.findIndex((f) => f.id === data.farmId);
    if (farmIdx !== -1) {
      farms[farmIdx].cropCount = (farms[farmIdx].cropCount || 0) + 1;
      setStoredData(STORAGE_KEYS.FARMS, farms);
    }

    return newCrop;
  },

  async updateCrop(id: string, updates: Partial<Crop>): Promise<Crop> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const crops = getStoredData<Crop[]>(STORAGE_KEYS.CROPS, []);
    const idx = crops.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Crop not found');

    const updated = { ...crops[idx], ...updates };
    crops[idx] = updated;
    setStoredData(STORAGE_KEYS.CROPS, crops);
    return updated;
  },

  async deleteCrop(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let crops = getStoredData<Crop[]>(STORAGE_KEYS.CROPS, []);
    const cropToDelete = crops.find((c) => c.id === id);
    crops = crops.filter((c) => c.id !== id);
    setStoredData(STORAGE_KEYS.CROPS, crops);

    if (cropToDelete) {
      const farms = getStoredData<any[]>(STORAGE_KEYS.FARMS, []);
      const farmIdx = farms.findIndex((f) => f.id === cropToDelete.farmId);
      if (farmIdx !== -1 && farms[farmIdx].cropCount > 0) {
        farms[farmIdx].cropCount -= 1;
        setStoredData(STORAGE_KEYS.FARMS, farms);
      }
    }
  }
};
