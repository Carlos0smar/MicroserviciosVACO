import axios from 'axios';
import { LoginCredentials, RegisterData, User, Event, EventFormData, Purchase, PurchaseRequest } from '../types';

const API_BASE_URL = 'http://localhost/api';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT a las requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};

// Servicios de eventos
export const eventService = {
  getAll: async (): Promise<Event[]> => {
    const response = await api.get('/eventos');
    return response.data.data; // Extraer solo la propiedad `data`
  },

  getById: async (id: number): Promise<Event> => {
    const response = await api.get(`/eventos/${id}`);
    return response.data;
  },

  create: async (event: EventFormData): Promise<Event> => {
    const response = await api.post('/eventos', event);
    return response.data;
  },

  update: async (id: number, event: EventFormData): Promise<Event> => {
    const response = await api.put(`/eventos/${id}`, event);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/eventos/${id}`);
  },
};

// Servicios de compras
export const purchaseService = {
  getAll: async (): Promise<Purchase[]> => {
    const response = await api.get('/compras');
    return response.data;
  },

  create: async (purchase: PurchaseRequest): Promise<Purchase> => {
    const response = await api.post('/compras', purchase);
    return response.data;
  },

  pay: async (eventoId: number): Promise<Purchase> => {
    const response = await api.put(`/compras/pagar/${eventoId}`);
    return response.data;
  },
};

export default api;