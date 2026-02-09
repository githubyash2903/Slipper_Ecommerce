import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as userApi from '../api/user';
import { toast } from './use-toast'; // ShadCN Toast

// --- HOOK: FETCH PROFILE ---
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: userApi.fetchProfile,
    staleTime: 1000 * 60 * 5, // Data 5 min tak fresh manega
    retry: 1,
  });
};

// --- HOOK: UPDATE PROFILE ---
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: () => {
      toast({ title: "Success", description: "Profile updated successfully!" });
      // Update hote hi naya data fetch karo
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: any) => {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: error.response?.data?.message || "Failed to update profile" 
      });
    },
  });
};

// --- HOOK: FETCH ADDRESSES ---
export const useAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: userApi.fetchAddresses,
  });
};

// --- HOOK: ADD ADDRESS ---
export const useAddAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.addAddress,
    onSuccess: () => {
      toast({ title: "Success", description: "Address added successfully!" });
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
    onError: (error: any) => {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: error.response?.data?.message || "Failed to add address" 
      });
    },
  });
};

// --- HOOK: DELETE ADDRESS ---
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.deleteAddress,
    onSuccess: () => {
      toast({ title: "Deleted", description: "Address deleted successfully." });
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
    onError: (error: any) => {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "Failed to delete address." 
      });
    },
  });
};

// --- HOOK: FETCH ORDERS ---
export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: userApi.fetchOrders,
  });
};