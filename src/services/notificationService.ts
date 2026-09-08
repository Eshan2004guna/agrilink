import { Notification, NotificationType } from '../types';
import { getStoredData, setStoredData, STORAGE_KEYS } from '../utils/storage';

export const notificationService = {
  async getNotifications(userId: string): Promise<Notification[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const notifs = getStoredData<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    return notifs.filter((n) => n.userId === userId);
  },

  async createNotification(data: {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    orderId?: string;
  }): Promise<Notification> {
    const notifs = getStoredData<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const newNotif: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type,
      isRead: false,
      createdAt: new Date().toISOString(),
      orderId: data.orderId,
    };
    notifs.unshift(newNotif);
    setStoredData(STORAGE_KEYS.NOTIFICATIONS, notifs);
    return newNotif;
  },

  async markAsRead(id: string): Promise<void> {
    const notifs = getStoredData<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const idx = notifs.findIndex((n) => n.id === id);
    if (idx !== -1) {
      notifs[idx].isRead = true;
      setStoredData(STORAGE_KEYS.NOTIFICATIONS, notifs);
    }
  },

  async markAllAsRead(userId: string): Promise<void> {
    const notifs = getStoredData<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    notifs.forEach((n) => {
      if (n.userId === userId) n.isRead = true;
    });
    setStoredData(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },

  async deleteNotification(id: string): Promise<void> {
    let notifs = getStoredData<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    notifs = notifs.filter((n) => n.id !== id);
    setStoredData(STORAGE_KEYS.NOTIFICATIONS, notifs);
  }
};
