import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Auto attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH
export const loginAPI = (data: { email: string; password: string }) =>
  API.post('/auth/login', data);

// ADMIN
export const getDashboardStats = () => API.get('/admin/dashboard');
export const getAllTenants = () => API.get('/admin/tenants');
export const createTenant = (data: any) => API.post('/admin/tenants', data);
export const deleteTenant = (id: string) => API.delete(`/admin/tenants/${id}`);
export const updateTenant = (id: string, data: any) => API.put(`/admin/tenants/${id}`, data);