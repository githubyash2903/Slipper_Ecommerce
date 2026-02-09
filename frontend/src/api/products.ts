import { authClient, publicClient } from './axios';

// --- TYPES ---
export interface ProductData {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  gender: string;
  image_url: string;
  sizes: number[];
  colors: string[];
  is_new: boolean;
  is_sale: boolean;
}

// --- ADMIN API CALLS ---
export const getProducts = async () => {
  const response = await authClient.get('/admin/product');
  return response.data.data; 
};

export const createProduct = async (data: ProductData) => {
  const response = await authClient.post('/admin/product', data);
  return response.data;
};

export const updateProduct = async (id: string, data: Partial<ProductData>) => {
  const response = await authClient.patch(`/admin/product/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await authClient.delete(`/admin/product/${id}`);
  return response.data;
};

// --- PUBLIC API CALLS  ---

export const getPublicProducts = async () => {
  const response = await publicClient.get('/user/product');
  return response.data.data || []; 
};

export const getProductById = async (id: string) => {
  const response = await publicClient.get(`/user/product/${id}`);
  return response.data.data; 
};