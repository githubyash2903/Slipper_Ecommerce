import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCartAPI, addToCartAPI, updateCartItemAPI, removeFromCartAPI, clearCartAPI } from '@/api/user';
import { useAuth } from '@/provider/AuthProvider';
import { toast } from '@/hooks/use-toast';
import { CartItem, Product } from '@/types/product';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, size: number, color: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isWholesale: boolean;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // --- 1. FETCH CART ---
  const { data: backendData = [], isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: getCartAPI,
    enabled: isAuthenticated, 
  });

  // --- 2. DATA MAPPING (UPDATED FOR NEW BACKEND RESPONSE) ---
  const items: CartItem[] = useMemo(() => {
    if (!backendData || !Array.isArray(backendData)) return [];

    // ✅ FIX: Ab backend se nested object aa raha hai, mapping simple ho gayi
    return backendData.map((item: any) => ({
      id: item.id, // Backend ab 'id' bhej raha hai (cart_item_id nahi)
      quantity: Number(item.quantity),
      size: !isNaN(Number(item.size)) ? Number(item.size) : 0,
      color: item.color || '',
      
      // Backend ab pura 'product' object bhej raha hai
      product: {
        id: item.product.id,
        name: item.product.name || 'Unknown',
        price: Number(item.product.price) || 0,
        image: item.product.image || '', // Backend ab 'image' key bhej raha hai
        stock: Number(item.product.stock) || 0,
        wholesalePrice: Number(item.product.wholesalePrice) || 0, // CamelCase from backend
        bulkThreshold: Number(item.product.bulkThreshold) || 0,   // CamelCase from backend
        
        // Default values for other fields required by TS
        isSale: false,
        salePercent: 0,
        description: '',
        category: '',
        gender: '',
        isNew: false,
        images: [],
        sizes: [],
        colors: [],
      } as unknown as Product
    }));
  }, [backendData]);

  // --- 3. MUTATIONS ---

  const addMutation = useMutation({
    mutationFn: addToCartAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({ title: "Success", description: "Item added to cart" });
    },
    onError: (error: any) => {
      console.error(error);
      toast({ title: "Error", description: "Could not add item", variant: "destructive" });
    }
  });

  const removeMutation = useMutation({
    mutationFn: removeFromCartAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({ title: "Removed", description: "Item removed from cart" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCartItemAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearCartAPI,
    onSuccess: () => {
      queryClient.setQueryData(['cart'], []); 
      toast({ title: "Cart Cleared", description: "All items removed" });
    },
    onError: () => {
      toast({ title: "Error", description: "Could not clear cart", variant: "destructive" });
    }
  });

  // --- 4. ACTION HANDLERS ---

  const addToCart = (product: Product, quantity: number, size: number, color: string) => {
    if (!isAuthenticated) {
      toast({ title: "Login Required", description: "Please login to add items", variant: "destructive" });
      return;
    }

    addMutation.mutate({
      product_id: product.id,
      quantity,
      size: String(size),
      color: color
    });
  };

  const removeFromCart = (cartItemId: string) => {
    removeMutation.mutate(cartItemId);
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    updateMutation.mutate({ id: cartItemId, quantity });
  };

  const clearCart = () => {
    clearMutation.mutate();
  };

  // --- 5. CALCULATIONS ---
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Wholesale check logic
  const isWholesale = items.some(item => 
    item.product.bulkThreshold > 0 && item.quantity >= item.product.bulkThreshold
  );

  const subtotal = items.reduce((sum, item) => {
    const p = item.product;
    const price = (p.bulkThreshold > 0 && item.quantity >= p.bulkThreshold)
      ? p.wholesalePrice 
      : p.price;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      isWholesale,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}