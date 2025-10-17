import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
});

export const googleAuth = code => api.get(`/auth/google?code=${code}`);
export const googleAdminAuth = code =>
  api.get(`/api/admin/google-login?code=${code}`);
