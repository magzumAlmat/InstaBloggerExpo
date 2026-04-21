import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Change this to your machine's local IP when testing on a real device
export const API_URL = 'http://172.20.10.7:3000/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
