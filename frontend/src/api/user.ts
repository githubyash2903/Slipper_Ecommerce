import { authClient } from './axios';

// --- PROFILE API ---
export const fetchProfile = async () => {
  const response = await authClient.get('/user/profile');
  return response.data.data;
};

export const updateProfile = async (data: { name?: string; phone?: string }) => {
  const response = await authClient.put('/user/profile', data);
  return response.data.data;
};

// --- ADDRESS API ---
export const fetchAddresses = async () => {
  const response = await authClient.get('/user/profile/addresses');
  return response.data.data;
};

export const addAddress = async (data: any) => {
  const response = await authClient.post('/user/profile/addresses', data);
  return response.data.data;
};

export const deleteAddress = async (id: string) => {
  const response = await authClient.delete(`/user/profile/addresses/${id}`);
  return response.data;
};

export const fetchOrders = async () => {
  const response = await authClient.get('/user/order');
  return response.data.data;
};


const CART_BASE = '/user/cart';

export const getCartAPI = async () => {
  const response = await authClient.get(CART_BASE);
  return response.data.data; 
};

// Add to Cart
export const addToCartAPI = async (item: { product_id: string; quantity: number; size: string; color: string }) => {
  const response = await authClient.post(CART_BASE, item);
  return response.data;
};

// Update Quantity
export const updateCartItemAPI = async ({ id, quantity }: { id: string; quantity: number }) => {
  const response = await authClient.patch(`${CART_BASE}/${id}`, { quantity });
  return response.data;
};

// Remove Item
export const removeFromCartAPI = async (id: string) => {
  const response = await authClient.delete(`${CART_BASE}/${id}`);
  return response.data;
};

export const clearCartAPI = async () => {
  const response = await authClient.delete(`${CART_BASE}/clear`);
  return response.data;
};




