import { authClient } from '../axios';

export const fetchDashboardStats = async () => {
 
  const response = await authClient.get('/admin/stats/');
  return response.data.data; 
};


export const fetchUsers = async (params: { page?: number; limit?: number; type?: string }) => {
  const response = await authClient.get('/admin/users', { params });
  return response.data.data;
};

export const deactivateUser = async (id: string) => {
  const response = await authClient.patch(`/admin/users/${id}/deactivate`);
  return response.data;
};


export const getAllOrdersAdminAPI = async () => {
    const response = await authClient.get('/admin/order/all');
    return response.data.data;
};

export const updateOrderStatusAPI = async (orderId: string, status: string) => {
    const response = await authClient.patch(`/admin/order/${orderId}/status`, { status });
    return response.data;
};

export const fetchAdminOrders = async () => {
  const res = await authClient.get('/admin/order/all');
  return res.data.data;
};
