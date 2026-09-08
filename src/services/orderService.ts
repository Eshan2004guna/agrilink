import { Order, OrderStatus, CartItem } from '../types';
import { getStoredData, setStoredData, STORAGE_KEYS } from '../utils/storage';
import { notificationService } from './notificationService';

export const orderService = {
  async getOrders(role?: string, userId?: string): Promise<Order[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const orders = getStoredData<Order[]>(STORAGE_KEYS.ORDERS, []);
    
    if (role === 'BUYER' && userId) {
      return orders.filter((o) => o.buyerId === userId);
    }
    if (role === 'FARMER' && userId) {
      return orders.filter((o) => o.farmerIds.includes(userId));
    }
    return orders; // Admin or full list
  },

  async getOrderById(id: string): Promise<Order | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const orders = getStoredData<Order[]>(STORAGE_KEYS.ORDERS, []);
    return orders.find((o) => o.id === id) || null;
  },

  async createOrder(checkoutData: {
    buyerId: string;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    deliveryName: string;
    phone: string;
    district: string;
    address: string;
    cartItems: CartItem[];
  }): Promise<Order> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const orders = getStoredData<Order[]>(STORAGE_KEYS.ORDERS, []);
    
    const farmerIdsSet = new Set<string>();
    const orderItems = checkoutData.cartItems.map((item, idx) => {
      farmerIdsSet.add(item.product.farmerId);
      return {
        id: `item-${Date.now()}-${idx}`,
        productId: item.product.id,
        productName: item.product.name,
        imageUrl: item.product.imageUrls[0],
        price: item.product.price,
        quantity: item.quantity,
        unit: item.product.unit,
        farmerId: item.product.farmerId,
        farmerName: item.product.farmerName,
      };
    });

    const totalAmount = checkoutData.cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `AGRI-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      buyerId: checkoutData.buyerId,
      buyerName: checkoutData.buyerName,
      buyerEmail: checkoutData.buyerEmail,
      buyerPhone: checkoutData.buyerPhone,
      farmerIds: Array.from(farmerIdsSet),
      deliveryName: checkoutData.deliveryName,
      phone: checkoutData.phone,
      district: checkoutData.district,
      address: checkoutData.address,
      items: orderItems,
      totalAmount,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    setStoredData(STORAGE_KEYS.ORDERS, orders);

    // Notify farmers about the new order
    for (const farmerId of farmerIdsSet) {
      await notificationService.createNotification({
        userId: farmerId,
        title: 'New Order Received',
        message: `Order #${newOrder.orderNumber} has been placed by ${checkoutData.buyerName}. Total Rs. ${totalAmount.toLocaleString()}`,
        type: 'ORDER',
        orderId: newOrder.id,
      });
    }

    return newOrder;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const orders = getStoredData<Order[]>(STORAGE_KEYS.ORDERS, []);
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');

    orders[idx].status = status;
    orders[idx].updatedAt = new Date().toISOString();
    setStoredData(STORAGE_KEYS.ORDERS, orders);

    // Notify buyer
    await notificationService.createNotification({
      userId: orders[idx].buyerId,
      title: `Order Status Updated: ${status}`,
      message: `Your order #${orders[idx].orderNumber} status has been updated to ${status}.`,
      type: 'ORDER',
      orderId: orders[idx].id,
    });

    return orders[idx];
  }
};
