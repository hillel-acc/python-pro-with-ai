import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { syncCart , getCart as apiGetCart} from '../api/client';
import type { CartItem } from '../api/client';

interface CartState {
  items: CartItem[];
  addItem: (productId: number, quantity: number, price: string) => Promise<void>;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  loadCart: () => Promise<void>;
  getTotal: () => number;
}

// Helper function to calculate subtotal
const calculateSubtotal = (item: CartItem): number => parseFloat(item.price) * item.quantity;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: async (productId: number, quantity: number, price: string) => {
        // 1. Optimistically update local state
        set((state) => {
          const existing = state.items.find((i) => i.product_id === productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product_id === productId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { product_id: productId, quantity, price }],
          };
        });

        // 2. Send to backend (fire and forget with error handling)
        try {
          await syncCart(get().items);
        } catch (error) {
          // 3. If backend fails, rollback and show error
          await get().loadCart(); // reload from backend
          throw new Error('Failed to add to cart');
        }
      },
      removeItem: (productId: number) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.product_id !== productId);
          return { items: newItems };
        });
      },
      updateQuantity: async (productId: number, quantity: number) => {
        set((state) => {
          const newItems = state.items.map((item) =>
            item.product_id === productId ? { ...item, quantity } : item
          );
          return { items: newItems };
        });
        await syncCart(get().items);
      },
      clearCart: () => set({ items: [] }),
      loadCart: async () => {
        try {
          const response = await apiGetCart();
          const items = response.data;
          set({ items });
        } catch (error) {
          // If not logged in, ignore
        }
      },
      getTotal: () => {
        const state = get();
        //return state.items??[].reduce((sum, item) => sum + calculateSubtotal(item), 0);
        return 0
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);