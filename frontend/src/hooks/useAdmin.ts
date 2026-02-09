import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adminApi from '../api/admin/admin';
import { useToast } from './use-toast';

// --- GET USERS HOOK ---
export const useAdminUsers = (params: { page: number; limit: number; type: string }) => {
  return useQuery({
    queryKey: ['admin-users', params], // Params change hote hi auto-refresh hoga
    queryFn: () => adminApi.fetchUsers(params),
    placeholderData: (previousData) => previousData, // Smooth pagination
  });
};

// --- DEACTIVATE USER HOOK ---
export const useDeactivateUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: adminApi.deactivateUser,
    onSuccess: () => {
      toast({ title: "Success", description: "User deactivated successfully" });
      // List ko refresh karo
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error: any) => {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: error.response?.data?.message || "Failed to deactivate user" 
      });
    },
  });
};