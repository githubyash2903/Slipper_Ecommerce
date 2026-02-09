import { authClient } from './axios';

// Get all addresses for the user
export const getAddressesAPI = async () => {
  const response = await authClient.get('/user/profile/addresses'); 
  return response.data.data;
};