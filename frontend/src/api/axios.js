import axios from 'axios';
import API_BASE from './config';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('triangleUser') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('triangleUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
