import { create } from 'zustand';
import type { User, Pet, ServiceOrder, InsuranceClaim } from '@/types';
import { mockUser, mockPets, mockServiceOrders, mockClaims } from '@/data/mock';

interface AppState {
  user: User | null;
  pets: Pet[];
  serviceOrders: ServiceOrder[];
  claims: InsuranceClaim[];
  currentPetId: string | null;
  setUser: (user: User) => void;
  addPet: (pet: Pet) => void;
  updatePet: (pet: Pet) => void;
  addServiceOrder: (order: ServiceOrder) => void;
  addClaim: (claim: InsuranceClaim) => void;
  setCurrentPetId: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: mockUser,
  pets: mockPets,
  serviceOrders: mockServiceOrders,
  claims: mockClaims,
  currentPetId: mockPets[0]?.id || null,
  setUser: (user) => set({ user }),
  addPet: (pet) => set((state) => ({ pets: [...state.pets, pet] })),
  updatePet: (pet) => set((state) => ({
    pets: state.pets.map(p => p.id === pet.id ? pet : p)
  })),
  addServiceOrder: (order) => set((state) => ({
    serviceOrders: [...state.serviceOrders, order]
  })),
  addClaim: (claim) => set((state) => ({
    claims: [...state.claims, claim]
  })),
  setCurrentPetId: (id) => set({ currentPetId: id }),
}));
