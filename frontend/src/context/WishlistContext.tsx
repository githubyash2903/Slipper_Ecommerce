import { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/provider/AuthProvider'; // Auth check ke liye
import { toast } from '@/hooks/use-toast';

// ✅ Ensure karein ki ye import path sahi ho (api/user.ts ya api/wishlist.ts)
import { fetchWishlistAPI, addToWishlistAPI, removeFromWishlistAPI } from '@/api/wishlist';

interface WishlistContextType {
  wishlist: any[]; // Type 'Product[]' bhi use kar sakte hain agar types defined hain
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  totalWishlistItems: number;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // 👇 DEBUG LOG ADD KAREIN
 

  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchWishlistAPI,
    enabled: isAuthenticated, 
    staleTime: 1000 * 60 * 5, 
  });

  
  // Add Mutation
  const addMutation = useMutation({
    mutationFn: addToWishlistAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] }); 
      toast({ title: "Added to Wishlist", description: "Item saved." });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Could not add to wishlist";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  });

  // Remove Mutation
  const removeMutation = useMutation({
    mutationFn: removeFromWishlistAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast({ title: "Removed from Wishlist" });
    },
    onError: () => {
      toast({ title: "Error", description: "Could not remove item", variant: "destructive" });
    }
  });


  const addToWishlist = (productId: string) => {
    if (!isAuthenticated) {
      toast({ title: "Login Required", description: "Please login to use wishlist", variant: "destructive" });
      return;
    }
    if (isInWishlist(productId)) return;
    
    addMutation.mutate(productId);
  };

  const removeFromWishlist = (productId: string) => {
    removeMutation.mutate(productId);
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item: any) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        totalWishlistItems: wishlist.length,
        isLoading
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}