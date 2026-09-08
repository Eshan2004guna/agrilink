export type UserRole = 'FARMER' | 'BUYER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  district: string;
  address: string;
  avatarUrl?: string;
  status: UserStatus;
  registeredAt: string;
}

export type LandSizeUnit = 'Acres' | 'Perches' | 'Hectares';

export interface Farm {
  id: string;
  name: string;
  description: string;
  district: string;
  city: string;
  address: string;
  landSize: number;
  landSizeUnit: LandSizeUnit;
  imageUrl: string;
  farmerId: string;
  farmerName: string;
  cropCount: number;
  createdAt: string;
}

export type CropStatus = 'PLANNED' | 'PLANTED' | 'GROWING' | 'READY_FOR_HARVEST' | 'HARVESTED';

export interface Crop {
  id: string;
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
}

export type ProductStatus = 'AVAILABLE' | 'OUT_OF_STOCK' | 'ARCHIVED';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number; // in LKR
  availableQuantity: number;
  unit: string;
  farmId: string;
  farmName: string;
  farmerId: string;
  farmerName: string;
  district: string;
  location: string;
  imageUrls: string[];
  status: ProductStatus;
  isFeatured?: boolean;
  rating?: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  iconName: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
  unit: string;
  farmerId: string;
  farmerName: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'READY_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  farmerIds: string[];
  deliveryName: string;
  phone: string;
  district: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 'ORDER' | 'SYSTEM' | 'CROP' | 'PRODUCT';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  orderId?: string;
}

export const SRI_LANKA_DISTRICTS = [
  'Ampara',
  'Anuradhapura',
  'Badulla',
  'Batticaloa',
  'Colombo',
  'Galle',
  'Gampaha',
  'Hambantota',
  'Jaffna',
  'Kalutara',
  'Kandy',
  'Kegalle',
  'Kilinochchi',
  'Kurunegala',
  'Mannar',
  'Matale',
  'Matara',
  'Monaragala',
  'Mullaitivu',
  'Nuwara Eliya',
  'Polonnaruwa',
  'Puttalam',
  'Ratnapura',
  'Trincomalee',
  'Vavuniya'
] as const;
