import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  category: string;
  stock: number;
}

interface CartStore {
  cartItems: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  total: number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      
      addToCart: (product) => set((state) => {
        const existingItem = state.cartItems.find(item => item.id === product.id);
        
        if (existingItem) {
          if (existingItem.quantity >= product.stock) {
            return state;
          }
          
          const updatedItems = state.cartItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          
          return {
            cartItems: updatedItems,
            total: calculateTotal(updatedItems)
          };
        }
        
        const updatedItems = [...state.cartItems, { ...product, quantity: 1 }];
        return {
          cartItems: updatedItems,
          total: calculateTotal(updatedItems)
        };
      }),
      
      removeFromCart: (productId) => set((state) => {
        const updatedItems = state.cartItems.filter(item => item.id !== productId);
        return {
          cartItems: updatedItems,
          total: calculateTotal(updatedItems)
        };
      }),
      
      decreaseQuantity: (productId) => set((state) => {
        const updatedItems = state.cartItems.map(item =>
          item.id === productId && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ).filter(item => item.quantity > 0);
        
        return {
          cartItems: updatedItems,
          total: calculateTotal(updatedItems)
        };
      }),
      
      clearCart: () => set({ cartItems: [], total: 0 }),
      
      total: 0,
    }),
    {
      name: 'shopping-cart',
    }
  )
);

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}