import { authClient} from '@/api/axios';

const ENDPOINT = '/admin/stock';

// 1. Dashboard Data Lana
export const fetchStockDashboardAPI = async () => {
  const response = await  authClient.get(`${ENDPOINT}/dashboard`);
  return response.data.data;
};

// 2. Stock Assign Karna
export const assignStockAPI = async (data: { employeeId: string, productId: string, quantity: number }) => {
  const response = await  authClient.post(`${ENDPOINT}/assign`, data);
  return response.data;
};

// 3. Sales Report Karna
export const recordSaleAPI = async (data: { employeeId: string, quantity: number }) => {
  const response = await  authClient.post(`${ENDPOINT}/sale`, data);
  return response.data;
};

