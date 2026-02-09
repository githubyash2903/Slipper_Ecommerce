import {authClient} from '@/api/axios'; 

const ENDPOINT = '/admin/employees';

// 1. Get All Employees
export const fetchEmployeesAPI = async () => {
  const response = await authClient.get(ENDPOINT);
  return response.data.data; 
};

// 2. Add Employee
export const addEmployeeAPI = async (data: { name: string; email: string; phone: string }) => {
  const response = await authClient.post(ENDPOINT, data);
  return response.data;
};

// 3. Update Employee
export const updateEmployeeAPI = async ({ id, data }: { id: string; data: any }) => {
  const response = await authClient.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

// 4. Toggle Status
export const toggleEmployeeStatusAPI = async (id: string) => {
  const response = await authClient.patch(`${ENDPOINT}/${id}/status`);
  return response.data;
};

// 5. Delete Employee
export const deleteEmployeeAPI = async (id: string) => {
  const response = await authClient.delete(`${ENDPOINT}/${id}`);
  return response.data;
};


export const fetchEmployeesWithStockAPI = async () => {
  const response = await authClient.get('/admin/employees/with-stock');
  return response.data.data; 
};