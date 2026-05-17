import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/user';
import type { CartItem } from '@/types/cart';

const calculateCartTotals = (items: CartItem[]) => ({
  totalItems: items.reduce((total, item) => total + item.quantity, 0),
  totalPrice: items.reduce((total, item) => total + item.price * item.quantity, 0),
});

// --- Auth Store ---
interface AuthState {
  user: User | null;
  token: string | null;
  tokenExpiresAt: number | null;
  isAuthenticated: boolean;
  login: (user: User, token: string, tokenExpiresAt?: number | null) => void;
  logout: () => void;
  isTokenExpired: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      tokenExpiresAt: null,
      isAuthenticated: false,
      login: (user, token, tokenExpiresAt = null) =>
        set({ user, token, tokenExpiresAt, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, tokenExpiresAt: null, isAuthenticated: false }),
      isTokenExpired: () => {
        const expiresAt = get().tokenExpiresAt;
        return Boolean(expiresAt && Date.now() >= expiresAt);
      },
    }),
    {
      name: 'auth-storage', // unique name
    }
  )
);

// --- Theme Store ---
interface ThemeState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

const applyTheme = (theme: 'light' | 'dark') => {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
      toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        set({ theme: nextTheme });
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        applyTheme(state?.theme ?? 'light');
      },
    }
  )
);

// --- Cart Store ---
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  setItems: (items: CartItem[]) => void;
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

      setItems: (items) => set({
        items,
        ...calculateCartTotals(items),
      }),

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
          ...calculateCartTotals(updatedItems),
        };
      }),

      removeItem: (id) => set((state) => {
        const updatedItems = state.items.filter(item => item.id !== id);
        return {
          items: updatedItems,
          ...calculateCartTotals(updatedItems),
        };
      }),

      updateQuantity: (id, quantity) => set((state) => {
        if (quantity <= 0) {
          // Instead of doing nothing, let's remove the item
          const updatedItems = state.items.filter(item => item.id !== id);
          return {
            items: updatedItems,
            ...calculateCartTotals(updatedItems),
          };
        }
        const updatedItems = state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        );
        return {
          items: updatedItems,
          ...calculateCartTotals(updatedItems),
        };
      }),

      clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
    }),
    {
      name: 'cart-storage', // unique name
    }
  )
);
