import { create } from 'zustand';
import type { User, Pet } from '@/types';
import { api } from '@/api/client';

interface AppState {
  user: User | null;
  pets: Pet[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (username: string, phone: string, password: string, city?: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  loadPets: () => Promise<void>;
  addPet: (pet: any) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  pets: [],
  isAuthenticated: false,
  isLoading: true,

  login: async (phone, password) => {
    const res = await api.auth.login({ phone, password });
    localStorage.setItem('pet_token', res.token);
    localStorage.setItem('pet_user', JSON.stringify(res.user));
    set({ user: res.user, isAuthenticated: true });
    await get().loadPets();
  },

  register: async (username, phone, password, city) => {
    const res = await api.auth.register({ username, phone, password, city });
    localStorage.setItem('pet_token', res.token);
    localStorage.setItem('pet_user', JSON.stringify(res.user));
    set({ user: res.user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('pet_token');
    localStorage.removeItem('pet_user');
    set({ user: null, pets: [], isAuthenticated: false });
  },

  loadUser: async () => {
    try {
      const token = localStorage.getItem('pet_token');
      const savedUser = localStorage.getItem('pet_user');
      
      if (token && savedUser) {
        const user = JSON.parse(savedUser);
        set({ user, isAuthenticated: true });
        try {
          const res = await api.auth.getProfile();
          set({ user: res.user });
          localStorage.setItem('pet_user', JSON.stringify(res.user));
        } catch (e) {}
      }
    } finally {
      set({ isLoading: false });
    }
  },

  loadPets: async () => {
    try {
      const res = await api.pets.getAll();
      set({ pets: res.pets });
    } catch (e) {
      console.error('加载宠物列表失败:', e);
    }
  },

  addPet: async (petData) => {
    await api.pets.create(petData);
    await get().loadPets();
  },
}));
