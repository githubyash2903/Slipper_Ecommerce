import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/products';
import { useToast } from './use-toast';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: api.getProducts,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: api.createProduct,
    onSuccess: () => {
      toast({ title: 'Success', description: 'Product created successfully' });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err: any) => {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateProduct(id, data),
    onSuccess: () => {
      toast({ title: 'Updated', description: 'Product updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: api.deleteProduct,
    onSuccess: () => {
      toast({ title: 'Deleted', description: 'Product removed successfully' });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const usePublicProducts = () => {
  return useQuery({
    queryKey: ['public-products'],
    queryFn: api.getPublicProducts,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => api.getProductById(id),
    enabled: !!id, 
  });
};