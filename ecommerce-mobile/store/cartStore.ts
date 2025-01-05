import type { CartState, Product } from '@/types/types';
import { create } from 'zustand';
export const useCart = create<CartState>((set) => ({
  items: [],
  addProduct: (product: Product) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.product.id === product.id);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        items: [...state.items, { product, quantity: 1 }],
      };
    });
  },
  increaseItemQuantity: (product: Product) => {
    set((state) => {
      const itemFound = state.items.find((item) => item.product.id === product.id);
      if (itemFound) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        items: [...state.items],
      };
    });
  },
  decreaseItemQuantity: (product: Product) => {
    set((state) => {
      const itemFound = state.items.find((item) => item.product.id === product.id);
      if (itemFound) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
        };
      }
      return {
        items: [...state.items.filter((item) => item.quantity > 0)],
      };
    });
  },
  resetCart: () => set({ items: [] }),
}));

