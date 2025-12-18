import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/lib/data/products';

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) =>
        set((state) => {
          // 이미 찜한 상품인지 확인
          const exists = state.items.some((item) => item.id === product.id);
          if (exists) {
            return state; // 이미 있으면 추가하지 않음
          }
          return { items: [...state.items, product] };
        }),
      
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      
      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id);
      },
      
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage', // localStorage 키
    }
  )
);

// Selectors
export const getTotalWishlistItems = (state: WishlistState) => state.items.length;
