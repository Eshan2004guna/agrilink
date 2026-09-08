import { User, Farm, Crop, Product, Category, Order, Notification } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-farmer-1',
    firstName: 'Kamal',
    lastName: 'Perera',
    email: 'farmer@agrilink.lk',
    phone: '+94 77 123 4567',
    role: 'FARMER',
    district: 'Nuwara Eliya',
    address: 'No 45, Valley View Road, Lindula, Nuwara Eliya',
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=250',
    status: 'ACTIVE',
    registeredAt: '2025-01-15'
  },
  {
    id: 'user-farmer-2',
    firstName: 'Saman',
    lastName: 'Kumara',
    email: 'saman@agrilink.lk',
    phone: '+94 71 987 6543',
    role: 'FARMER',
    district: 'Jaffna',
    address: 'Point Pedro Road, Nallur, Jaffna',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    status: 'ACTIVE',
    registeredAt: '2025-02-01'
  },
  {
    id: 'user-buyer-1',
    firstName: 'Dilani',
    lastName: 'Fernando',
    email: 'buyer@agrilink.lk',
    phone: '+94 76 555 1234',
    role: 'BUYER',
    district: 'Colombo',
    address: 'No 12, Park Street, Colombo 02',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    status: 'ACTIVE',
    registeredAt: '2025-03-10'
  },
  {
    id: 'user-admin-1',
    firstName: 'Anura',
    lastName: 'Jayawardena',
    email: 'admin@agrilink.lk',
    phone: '+94 11 234 5678',
    role: 'ADMIN',
    district: 'Colombo',
    address: 'Agri Link HQ, Main Street, Colombo 01',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    status: 'ACTIVE',
    registeredAt: '2024-11-01'
  }
];

export const INITIAL_FARMS: Farm[] = [
  {
    id: 'farm-1',
    name: 'Nuwara Eliya Highland Farm',
    description: 'Specializing in fresh up-country crisp vegetables grown at high altitudes using sustainable organic practices.',
    district: 'Nuwara Eliya',
    city: 'Lindula',
    address: 'Highland Ridge Road, Nuwara Eliya',
    landSize: 4.5,
    landSizeUnit: 'Acres',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
    farmerId: 'user-farmer-1',
    farmerName: 'Kamal Perera',
    cropCount: 4,
    createdAt: '2025-01-20'
  },
  {
    id: 'farm-2',
    name: 'Jaffna Red Soil Organic Acres',
    description: 'Famous for high-yielding premium Jaffna red onions, chilies, and fresh root crops cultivated on fertile northern soils.',
    district: 'Jaffna',
    city: 'Nallur',
    address: 'Agro Canal Road, Jaffna',
    landSize: 6.0,
    landSizeUnit: 'Acres',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb16655?auto=format&fit=crop&q=80&w=800',
    farmerId: 'user-farmer-2',
    farmerName: 'Saman Kumara',
    cropCount: 3,
    createdAt: '2025-02-05'
  },
  {
    id: 'farm-3',
    name: 'Kurunegala Coconut & Spice Estate',
    description: 'Eco-friendly intercropped coconut estate producing king coconuts, Ceylon cinnamon, and fresh pepper.',
    district: 'Kurunegala',
    city: 'Narammala',
    address: 'Coconut Triangle Road, Kurunegala',
    landSize: 12.0,
    landSizeUnit: 'Acres',
    imageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=800',
    farmerId: 'user-farmer-1',
    farmerName: 'Kamal Perera',
    cropCount: 3,
    createdAt: '2025-02-18'
  }
];

export const INITIAL_CROPS: Crop[] = [
  {
    id: 'crop-1',
    cropName: 'Nuwara Eliya Orange Carrots',
    farmId: 'farm-1',
    farmName: 'Nuwara Eliya Highland Farm',
    farmerId: 'user-farmer-1',
    category: 'Vegetables',
    plantingDate: '2025-01-10',
    expectedHarvestDate: '2025-04-15',
    quantity: 1200,
    unit: 'kg',
    status: 'READY_FOR_HARVEST',
    notes: 'Crisp high altitude soil harvest. Excellent sweet flavor.'
  },
  {
    id: 'crop-2',
    cropName: 'Organic Leeks',
    farmId: 'farm-1',
    farmName: 'Nuwara Eliya Highland Farm',
    farmerId: 'user-farmer-1',
    category: 'Vegetables',
    plantingDate: '2025-02-01',
    expectedHarvestDate: '2025-05-10',
    quantity: 800,
    unit: 'kg',
    status: 'GROWING',
    notes: 'Healthy stem growth, natural compost fertilizers applied.'
  },
  {
    id: 'crop-3',
    cropName: 'Jaffna Red Shallots (Onions)',
    farmId: 'farm-2',
    farmName: 'Jaffna Red Soil Organic Acres',
    farmerId: 'user-farmer-2',
    category: 'Vegetables',
    plantingDate: '2025-01-05',
    expectedHarvestDate: '2025-03-30',
    quantity: 2500,
    unit: 'kg',
    status: 'READY_FOR_HARVEST',
    notes: 'High pungency, sun-dried red onions.'
  },
  {
    id: 'crop-4',
    cropName: 'Ceylon Cinnamon Bark',
    farmId: 'farm-3',
    farmName: 'Kurunegala Coconut & Spice Estate',
    farmerId: 'user-farmer-1',
    category: 'Spices',
    plantingDate: '2024-06-01',
    expectedHarvestDate: '2025-06-01',
    quantity: 350,
    unit: 'kg',
    status: 'GROWING',
    notes: 'Alba grade true Ceylon cinnamon quills.'
  },
  {
    id: 'crop-5',
    cropName: 'King Coconut (Thambili)',
    farmId: 'farm-3',
    farmName: 'Kurunegala Coconut & Spice Estate',
    farmerId: 'user-farmer-1',
    category: 'Fruits',
    plantingDate: '2024-01-01',
    expectedHarvestDate: '2025-04-01',
    quantity: 1500,
    unit: 'Pieces',
    status: 'HARVESTED',
    notes: 'Naturally sweet nutrient-dense hydration nuts.'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Vegetables',
    description: 'Fresh upcountry and lowcountry vegetables harvested daily.',
    iconName: 'Carrot',
    productCount: 18
  },
  {
    id: 'cat-2',
    name: 'Fruits',
    description: 'Tropical and highland Sri Lankan fruits bursting with natural sweetness.',
    iconName: 'Apple',
    productCount: 14
  },
  {
    id: 'cat-3',
    name: 'Spices & Herbs',
    description: 'Authentic Ceylon cinnamon, cardamom, black pepper, and curry leaves.',
    iconName: 'Sparkles',
    productCount: 10
  },
  {
    id: 'cat-4',
    name: 'Grains & Rice',
    description: 'Traditional Sri Lankan rice varieties including Red Raw, Samba, and Suwandel.',
    iconName: 'Wheat',
    productCount: 8
  },
  {
    id: 'cat-5',
    name: 'Coconut Products',
    description: 'Fresh coconuts, king coconuts, virgin coconut oil, and coconut jaggery.',
    iconName: 'TreePalm',
    productCount: 6
  },
  {
    id: 'cat-6',
    name: 'Tea & Beverage',
    description: 'Pure Ceylon single-origin tea leaves and herbal infusions.',
    iconName: 'Coffee',
    productCount: 5
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Fresh Nuwara Eliya Carrots',
    description: 'Sweet, crisp, and vibrant orange carrots harvested directly from high-altitude Nuwara Eliya farms. Free from harmful pesticides.',
    category: 'Vegetables',
    price: 280,
    availableQuantity: 450,
    unit: 'kg',
    farmId: 'farm-1',
    farmName: 'Nuwara Eliya Highland Farm',
    farmerId: 'user-farmer-1',
    farmerName: 'Kamal Perera',
    district: 'Nuwara Eliya',
    location: 'Lindula, Nuwara Eliya',
    imageUrls: [
      'https://images.unsplash.com/photo-1598170845058-12ef4a457939?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1447175008436-0841719b8b80?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'AVAILABLE',
    isFeatured: true,
    rating: 4.9,
    createdAt: '2025-02-28'
  },
  {
    id: 'prod-2',
    name: 'Jaffna Premium Red Shallots (Onions)',
    description: 'Authentic Jaffna red onions famous across Sri Lanka for their rich aroma, strong flavor, and medicinal benefits.',
    category: 'Vegetables',
    price: 420,
    availableQuantity: 800,
    unit: 'kg',
    farmId: 'farm-2',
    farmName: 'Jaffna Red Soil Organic Acres',
    farmerId: 'user-farmer-2',
    farmerName: 'Saman Kumara',
    district: 'Jaffna',
    location: 'Nallur, Jaffna',
    imageUrls: [
      'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'AVAILABLE',
    isFeatured: true,
    rating: 4.8,
    createdAt: '2025-03-01'
  },
  {
    id: 'prod-3',
    name: 'Organic Sweet King Coconuts (Thambili)',
    description: 'Freshly plucked King Coconuts rich in natural electrolytes and sweet coconut water. Harvested to order from Kurunegala.',
    category: 'Coconut Products',
    price: 120,
    availableQuantity: 300,
    unit: 'Pieces',
    farmId: 'farm-3',
    farmName: 'Kurunegala Coconut & Spice Estate',
    farmerId: 'user-farmer-1',
    farmerName: 'Kamal Perera',
    district: 'Kurunegala',
    location: 'Narammala, Kurunegala',
    imageUrls: [
      'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'AVAILABLE',
    isFeatured: true,
    rating: 5.0,
    createdAt: '2025-03-02'
  },
  {
    id: 'prod-4',
    name: 'Pure Ceylon Alba Cinnamon Sticks (100g)',
    description: 'Grade Alba true Ceylon cinnamon quills hand-peeled in Kurunegala. Sweet aroma, low coumarin content, highly prized globally.',
    category: 'Spices & Herbs',
    price: 1450,
    availableQuantity: 60,
    unit: 'Packs',
    farmId: 'farm-3',
    farmName: 'Kurunegala Coconut & Spice Estate',
    farmerId: 'user-farmer-1',
    farmerName: 'Kamal Perera',
    district: 'Kurunegala',
    location: 'Narammala, Kurunegala',
    imageUrls: [
      'https://images.unsplash.com/photo-1509358271058-acd05cc93898?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'AVAILABLE',
    isFeatured: true,
    rating: 4.95,
    createdAt: '2025-03-03'
  },
  {
    id: 'prod-5',
    name: 'Highland Green Cabbage',
    description: 'Firm, dense, pesticide-monitored cabbage heads grown in cool Nuwara Eliya weather.',
    category: 'Vegetables',
    price: 210,
    availableQuantity: 500,
    unit: 'kg',
    farmId: 'farm-1',
    farmName: 'Nuwara Eliya Highland Farm',
    farmerId: 'user-farmer-1',
    farmerName: 'Kamal Perera',
    district: 'Nuwara Eliya',
    location: 'Lindula, Nuwara Eliya',
    imageUrls: [
      'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'AVAILABLE',
    isFeatured: false,
    rating: 4.7,
    createdAt: '2025-03-04'
  },
  {
    id: 'prod-6',
    name: 'Fresh Ceylon Black Tea OP Leaves (500g)',
    description: 'Handpicked Orange Pekoe Ceylon black tea leaves from high elevation gardens.',
    category: 'Tea & Beverage',
    price: 950,
    availableQuantity: 120,
    unit: 'Packs',
    farmId: 'farm-1',
    farmName: 'Nuwara Eliya Highland Farm',
    farmerId: 'user-farmer-1',
    farmerName: 'Kamal Perera',
    district: 'Nuwara Eliya',
    location: 'Lindula, Nuwara Eliya',
    imageUrls: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'AVAILABLE',
    isFeatured: false,
    rating: 4.85,
    createdAt: '2025-03-05'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'AGRI-2025-001',
    buyerId: 'user-buyer-1',
    buyerName: 'Dilani Fernando',
    buyerEmail: 'buyer@agrilink.lk',
    buyerPhone: '+94 76 555 1234',
    farmerIds: ['user-farmer-1'],
    deliveryName: 'Dilani Fernando',
    phone: '+94 76 555 1234',
    district: 'Colombo',
    address: 'No 12, Park Street, Colombo 02',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        productName: 'Fresh Nuwara Eliya Carrots',
        imageUrl: 'https://images.unsplash.com/photo-1598170845058-12ef4a457939?auto=format&fit=crop&q=80&w=800',
        price: 280,
        quantity: 5,
        unit: 'kg',
        farmerId: 'user-farmer-1',
        farmerName: 'Kamal Perera'
      },
      {
        id: 'item-2',
        productId: 'prod-3',
        productName: 'Organic Sweet King Coconuts (Thambili)',
        imageUrl: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&q=80&w=800',
        price: 120,
        quantity: 10,
        unit: 'Pieces',
        farmerId: 'user-farmer-1',
        farmerName: 'Kamal Perera'
      }
    ],
    totalAmount: 2600,
    status: 'CONFIRMED',
    createdAt: '2025-03-06T10:30:00Z',
    updatedAt: '2025-03-06T11:15:00Z'
  },
  {
    id: 'ord-1002',
    orderNumber: 'AGRI-2025-002',
    buyerId: 'user-buyer-1',
    buyerName: 'Dilani Fernando',
    buyerEmail: 'buyer@agrilink.lk',
    buyerPhone: '+94 76 555 1234',
    farmerIds: ['user-farmer-2'],
    deliveryName: 'Dilani Fernando',
    phone: '+94 76 555 1234',
    district: 'Colombo',
    address: 'No 12, Park Street, Colombo 02',
    items: [
      {
        id: 'item-3',
        productId: 'prod-2',
        productName: 'Jaffna Premium Red Shallots (Onions)',
        imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=800',
        price: 420,
        quantity: 10,
        unit: 'kg',
        farmerId: 'user-farmer-2',
        farmerName: 'Saman Kumara'
      }
    ],
    totalAmount: 4200,
    status: 'PENDING',
    createdAt: '2025-03-07T08:15:00Z',
    updatedAt: '2025-03-07T08:15:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-farmer-1',
    title: 'New Order Received',
    message: 'Order #AGRI-2025-001 has been placed for 5kg Carrots & 10 King Coconuts.',
    type: 'ORDER',
    isRead: false,
    createdAt: '2025-03-06T10:30:00Z',
    orderId: 'ord-1001'
  },
  {
    id: 'notif-2',
    userId: 'user-buyer-1',
    title: 'Order Status Confirmed',
    message: 'Farmer Kamal Perera has confirmed your order #AGRI-2025-001.',
    type: 'ORDER',
    isRead: true,
    createdAt: '2025-03-06T11:15:00Z',
    orderId: 'ord-1001'
  },
  {
    id: 'notif-3',
    userId: 'user-farmer-1',
    title: 'Crop Harvest Reminder',
    message: 'Crop "Nuwara Eliya Orange Carrots" is ready for harvest!',
    type: 'CROP',
    isRead: false,
    createdAt: '2025-03-05T09:00:00Z'
  }
];
