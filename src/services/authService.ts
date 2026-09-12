import { User, UserRole } from '../types';
import { getStoredData, setStoredData, STORAGE_KEYS, initializeStorage } from '../utils/storage';

initializeStorage();

export const authService = {
  async login(email: string, password?: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const users: User[] = getStoredData(STORAGE_KEYS.USERS, []);
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!found) {
      throw new Error('Invalid email or password');
    }
    if (found.status === 'SUSPENDED') {
      throw new Error('Your account has been suspended. Please contact admin.');
    }

    setStoredData(STORAGE_KEYS.CURRENT_USER, found);
    return found;
  },

  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: UserRole;
    password?: string;
  }): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const users: User[] = getStoredData(STORAGE_KEYS.USERS, []);
    
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      role: data.role,
      district: 'Colombo',
      address: 'Not specified',
      status: 'ACTIVE',
      registeredAt: new Date().toISOString().split('T')[0],
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.firstName}`,
    };

    users.push(newUser);
    setStoredData(STORAGE_KEYS.USERS, users);
    setStoredData(STORAGE_KEYS.CURRENT_USER, newUser);
    return newUser;
  },

  async getCurrentUser(): Promise<User | null> {
    return getStoredData<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  },

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const users: User[] = getStoredData(STORAGE_KEYS.USERS, []);
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error('User not found');

    const updatedUser = { ...users[index], ...updates };
    users[index] = updatedUser;
    setStoredData(STORAGE_KEYS.USERS, users);

    const currentUser = getStoredData<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (currentUser?.id === userId) {
      setStoredData(STORAGE_KEYS.CURRENT_USER, updatedUser);
    }
    return updatedUser;
  },

  async changePassword(userId: string, currentPass: string, newPass: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (!currentPass || !newPass) throw new Error('Password cannot be empty');
    if (newPass.length < 6) throw new Error('New password must be at least 6 characters');
  },

  async resetPassword(email: string, newPass: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const users: User[] = getStoredData(STORAGE_KEYS.USERS, []);
    const index = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());

    if (index === -1) {
      throw new Error('No account registered with this email address.');
    }

    const updatedUser = { ...users[index] };
    users[index] = updatedUser;
    setStoredData(STORAGE_KEYS.USERS, users);
    setStoredData(STORAGE_KEYS.CURRENT_USER, updatedUser);
    return updatedUser;
  }
};
