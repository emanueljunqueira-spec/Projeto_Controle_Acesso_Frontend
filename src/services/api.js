import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333', // <--- Endereço fixo do backend
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rfid_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('rfid_token');
      localStorage.removeItem('rfid_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;