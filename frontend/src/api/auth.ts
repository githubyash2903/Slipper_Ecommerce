import { publicClient } from './axios';

export const registerUser = async (payload: any) => {
  return await publicClient.post('/auth/register', payload);
};

export const loginUser = async (payload: {
  email: string;
  password: string;
}) => {
  return await publicClient.post('/auth/login', payload);
};

export const logoutUser = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  window.location.reload();

};
