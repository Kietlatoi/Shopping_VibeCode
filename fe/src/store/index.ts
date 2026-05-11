import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/user';
import type { CartItem } from '@/types/cart';

// --- Auth Store ---
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // unique name
    }
  )
);

// --- Cart Store ---
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (newItem) => set((state) => {
        const existingItem = state.items.find(item => item.id === newItem.id);
        let updatedItems;
        if (existingItem) {
          updatedItems = state.items.map(item =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          );
        } else {
          updatedItems = [...state.items, newItem];
        }
        return {
          items: updatedItems,
          totalItems: updatedItems.reduce((total, item) => total + item.quantity, 0),
          totalPrice: updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
        };
      }),

      removeItem: (id) => set((state) => {
        const updatedItems = state.items.filter(item => item.id !== id);
        return {
          items: updatedItems,
          totalItems: updatedItems.reduce((total, item) => total + item.quantity, 0),
          totalPrice: updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
        };
      }),

      updateQuantity: (id, quantity) => set((state) => {
        if (quantity <= 0) {
          // Instead of doing nothing, let's remove the item
          const updatedItems = state.items.filter(item => item.id !== id);
          return {
            items: updatedItems,
            totalItems: updatedItems.reduce((total, item) => total + item.quantity, 0),
            totalPrice: updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
          };
        }
        const updatedItems = state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        );
        return {
          items: updatedItems,
          totalItems: updatedItems.reduce((total, item) => total + item.quantity, 0),
          totalPrice: updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
        };
      }),

      clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
    }),
    {
      name: 'cart-storage', // unique name
    }
  )
);
