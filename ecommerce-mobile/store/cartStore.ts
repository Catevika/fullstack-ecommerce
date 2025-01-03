import type { CartState, Product } from '@/types/types';
import { create } from 'zustand';
export const useCart = create<CartState>((set) => ({
  items: [],
  addProduct: (product: Product) => {
    // TODO - If already in cart, increment quantity else add to cart
    set((state) => ({
      items: [...state.items, { product, quantity: 1 }],
    }));
  },
  resetCart: () => set({ items: [] }),
}));