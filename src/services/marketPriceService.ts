export interface PricePoint {
  date: string;
  price: number;
}

export interface MarketPriceItem {
  id: string;
  cropName: string;
  cropCategory: 'Vegetables' | 'Rice & Grains' | 'Spices' | 'Fruits' | 'Tea';
  unit: string;
  economicCentre: 'Dambulla' | 'Keppetipola' | 'Jaffna' | 'Meegoda' | 'Peliyagoda';
  wholesalePrice: number; // Price per unit in LKR at Economic Centre
  retailMarketPrice: number; // Retail price per unit in LKR in cities
  agriLinkDirectPrice: number; // Direct farmer price on AgriLink
  priceChange: number; // Price change in LKR (+15, -10, etc.)
  trend: 'UP' | 'DOWN' | 'STABLE';
  district: string;
  history7Days: PricePoint[];
  updatedAt: string;
  imageUrl: string;
}

const MOCK_MARKET_PRICES: MarketPriceItem[] = [
  {
    id: 'mkt-1',
    cropName: 'Nuwara Eliya Carrot',
    cropCategory: 'Vegetables',
    unit: 'kg',
    economicCentre: 'Dambulla',
    wholesalePrice: 310,
    retailMarketPrice: 380,
    agriLinkDirectPrice: 280,
    priceChange: 15,
    trend: 'UP',
    district: 'Nuwara Eliya',
    updatedAt: 'Today, 06:30 AM',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=400',
    history7Days: [
      { date: 'Mon', price: 270 },
      { date: 'Tue', price: 280 },
      { date: 'Wed', price: 290 },
      { date: 'Thu', price: 295 },
      { date: 'Fri', price: 300 },
      { date: 'Sat', price: 305 },
      { date: 'Sun', price: 310 },
    ],
  },
  {
    id: 'mkt-2',
    cropName: 'Jaffna Red Shallots (Small Onion)',
    cropCategory: 'Vegetables',
    unit: 'kg',
    economicCentre: 'Jaffna',
    wholesalePrice: 420,
    retailMarketPrice: 510,
    agriLinkDirectPrice: 380,
    priceChange: -20,
    trend: 'DOWN',
    district: 'Jaffna',
    updatedAt: 'Today, 07:00 AM',
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=400',
    history7Days: [
      { date: 'Mon', price: 460 },
      { date: 'Tue', price: 450 },
      { date: 'Wed', price: 440 },
      { date: 'Thu', price: 435 },
      { date: 'Fri', price: 430 },
      { date: 'Sat', price: 425 },
      { date: 'Sun', price: 420 },
    ],
  },
  {
    id: 'mkt-3',
    cropName: 'Green Chili (Green Pepper)',
    cropCategory: 'Vegetables',
    unit: 'kg',
    economicCentre: 'Dambulla',
    wholesalePrice: 650,
    retailMarketPrice: 780,
    agriLinkDirectPrice: 600,
    priceChange: 35,
    trend: 'UP',
    district: 'Matale',
    updatedAt: 'Today, 06:15 AM',
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&q=80&w=400',
    history7Days: [
      { date: 'Mon', price: 580 },
      { date: 'Tue', price: 590 },
      { date: 'Wed', price: 610 },
      { date: 'Thu', price: 620 },
      { date: 'Fri', price: 635 },
      { date: 'Sat', price: 640 },
      { date: 'Sun', price: 650 },
    ],
  },
  {
    id: 'mkt-4',
    cropName: 'Pure Ceylon Alba Cinnamon',
    cropCategory: 'Spices',
    unit: 'kg',
    economicCentre: 'Meegoda',
    wholesalePrice: 4200,
    retailMarketPrice: 4950,
    agriLinkDirectPrice: 3850,
    priceChange: 0,
    trend: 'STABLE',
    district: 'Kurunegala',
    updatedAt: 'Today, 07:45 AM',
    imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=400',
    history7Days: [
      { date: 'Mon', price: 4200 },
      { date: 'Tue', price: 4200 },
      { date: 'Wed', price: 4200 },
      { date: 'Thu', price: 4200 },
      { date: 'Fri', price: 4200 },
      { date: 'Sat', price: 4200 },
      { date: 'Sun', price: 4200 },
    ],
  },
  {
    id: 'mkt-5',
    cropName: 'Highland Leeks',
    cropCategory: 'Vegetables',
    unit: 'kg',
    economicCentre: 'Keppetipola',
    wholesalePrice: 240,
    retailMarketPrice: 310,
    agriLinkDirectPrice: 210,
    priceChange: -12,
    trend: 'DOWN',
    district: 'Badulla',
    updatedAt: 'Today, 06:40 AM',
    imageUrl: 'https://images.unsplash.com/photo-1608797178974-15b35a6405cb?auto=format&fit=crop&q=80&w=400',
    history7Days: [
      { date: 'Mon', price: 270 },
      { date: 'Tue', price: 265 },
      { date: 'Wed', price: 260 },
      { date: 'Thu', price: 255 },
      { date: 'Fri', price: 250 },
      { date: 'Sat', price: 245 },
      { date: 'Sun', price: 240 },
    ],
  },
  {
    id: 'mkt-6',
    cropName: 'Ceylon Keeri Samba Rice',
    cropCategory: 'Rice & Grains',
    unit: 'kg',
    economicCentre: 'Peliyagoda',
    wholesalePrice: 295,
    retailMarketPrice: 340,
    agriLinkDirectPrice: 275,
    priceChange: 5,
    trend: 'UP',
    district: 'Polonnaruwa',
    updatedAt: 'Today, 07:10 AM',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400',
    history7Days: [
      { date: 'Mon', price: 285 },
      { date: 'Tue', price: 285 },
      { date: 'Wed', price: 288 },
      { date: 'Thu', price: 290 },
      { date: 'Fri', price: 292 },
      { date: 'Sat', price: 294 },
      { date: 'Sun', price: 295 },
    ],
  },
  {
    id: 'mkt-7',
    cropName: 'Fresh Orange King Coconut (Thambili)',
    cropCategory: 'Fruits',
    unit: 'nut',
    economicCentre: 'Meegoda',
    wholesalePrice: 120,
    retailMarketPrice: 160,
    agriLinkDirectPrice: 100,
    priceChange: 10,
    trend: 'UP',
    district: 'Kurunegala',
    updatedAt: 'Today, 06:50 AM',
    imageUrl: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&q=80&w=400',
    history7Days: [
      { date: 'Mon', price: 100 },
      { date: 'Tue', price: 105 },
      { date: 'Wed', price: 110 },
      { date: 'Thu', price: 112 },
      { date: 'Fri', price: 115 },
      { date: 'Sat', price: 118 },
      { date: 'Sun', price: 120 },
    ],
  },
  {
    id: 'mkt-8',
    cropName: 'Ceylon OP Grade Black Tea',
    cropCategory: 'Tea',
    unit: 'kg',
    economicCentre: 'Peliyagoda',
    wholesalePrice: 1850,
    retailMarketPrice: 2200,
    agriLinkDirectPrice: 1680,
    priceChange: 0,
    trend: 'STABLE',
    district: 'Ratnapura',
    updatedAt: 'Today, 07:30 AM',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=400',
    history7Days: [
      { date: 'Mon', price: 1850 },
      { date: 'Tue', price: 1850 },
      { date: 'Wed', price: 1850 },
      { date: 'Thu', price: 1850 },
      { date: 'Fri', price: 1850 },
      { date: 'Sat', price: 1850 },
      { date: 'Sun', price: 1850 },
    ],
  },
];

export const marketPriceService = {
  async getMarketPrices(filters?: {
    economicCentre?: string;
    category?: string;
    search?: string;
  }): Promise<MarketPriceItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    let result = [...MOCK_MARKET_PRICES];

    if (filters?.economicCentre && filters.economicCentre !== 'ALL') {
      result = result.filter((item) => item.economicCentre === filters.economicCentre);
    }

    if (filters?.category && filters.category !== 'ALL') {
      result = result.filter((item) => item.cropCategory === filters.category);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (item) =>
          item.cropName.toLowerCase().includes(q) ||
          item.district.toLowerCase().includes(q) ||
          item.economicCentre.toLowerCase().includes(q)
      );
    }

    return result;
  },

  async getMarketPriceById(id: string): Promise<MarketPriceItem | null> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return MOCK_MARKET_PRICES.find((item) => item.id === id) || null;
  },

  getEconomicCentres(): string[] {
    return ['ALL', 'Dambulla', 'Keppetipola', 'Jaffna', 'Meegoda', 'Peliyagoda'];
  },

  getCategories(): string[] {
    return ['ALL', 'Vegetables', 'Rice & Grains', 'Spices', 'Fruits', 'Tea'];
  }
};
