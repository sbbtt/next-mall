import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/lib/data/products';

// 장바구니 아이템 타입 (기존 상품 타입 + 수량)
export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);
          if (existingItem) {
            // 이미 있으면 수량만 +1
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          // 없으면 새로 추가 (수량 1)
          return { items: [...state.items, { ...product, quantity: 1 }] };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage', // localStorage에 저장될 이름
    }
  )
);
