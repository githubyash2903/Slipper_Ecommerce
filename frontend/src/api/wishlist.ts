import { authClient } from './axios';



const BASE_URL = '/user/wishlist';

// 1. Get List
export const fetchWishlistAPI = async () => {
    const response = await authClient.get(BASE_URL);
    return response.data.data; 
};

// 2. Add Item
export const addToWishlistAPI = async (productId: string) => {
    const response = await authClient.post(BASE_URL, { productId });
    return response.data;
};

// 3. Remove Item
export const removeFromWishlistAPI = async (productId: string) => {
    const response = await authClient.delete(`${BASE_URL}/${productId}`);
    return response.data;
};


