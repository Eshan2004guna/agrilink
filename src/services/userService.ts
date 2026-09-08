import { User } from '../types';
import { getStoredData, setStoredData, STORAGE_KEYS } from '../utils/storage';

export const userService = {
  async getAllUsers(): Promise<User[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return getStoredData<User[]>(STORAGE_KEYS.USERS, []);
  },

  async updateUserStatus(userId: string, status: 'ACTIVE' | 'SUSPENDED'): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const users = getStoredData<User[]>(STORAGE_KEYS.USERS, []);
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error('User not found');

    users[idx].status = status;
    setStoredData(STORAGE_KEYS.USERS, users);
    return users[idx];
  }
};
