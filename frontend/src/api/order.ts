import { authClient } from './axios'; 

import axios from 'axios';

const API_URL = 'https://slipper-ecommerce.onrender.com/api/v1';

export const placeOrderAPI = async (orderData: any) => {
  const response = await authClient.post('/user/order', orderData);
  return response.data;
};
export const getMyOrdersAPI = async () => {
  const response = await authClient.get('/user/order');
  return response.data;
};


export const createRazorpayOrderAPI = async (data: { amount: number; currency: string }) => {
  const response = await authClient.post(`/user/order/razorpay`, data);
  return response.data; 
}

// 2. Verify the payment signature
export const verifyPaymentAPI = async (payload: any) => {
  const response = await authClient.post(`/user/order/verify`, payload);
  return response.data; 
};
