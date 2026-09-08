import { INITIAL_USERS, INITIAL_FARMS, INITIAL_CROPS, INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_ORDERS, INITIAL_NOTIFICATIONS } from '../mock/initialData';
import { User, Farm, Crop, Product, Category, Order, Notification } from '../types';

const STORAGE_KEYS = {
  USERS: 'agrilink_users',
  FARMS: 'agrilink_farms',
  CROPS: 'agrilink_crops',
  PRODUCTS: 'agrilink_products',
  CATEGORIES: 'agrilink_categories',
  ORDERS: 'agrilink_orders',
  NOTIFICATIONS: 'agrilink_notifications',
  CURRENT_USER: 'agrilink_current_user',
  CART: 'agrilink_cart',
};

export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FARMS)) {
    localStorage.setItem(STORAGE_KEYS.FARMS, JSON.stringify(INITIAL_FARMS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CROPS)) {
    localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(INITIAL_CROPS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
};

// Generic helpers
export function getStoredData<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

export function setStoredData<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export { STORAGE_KEYS };
