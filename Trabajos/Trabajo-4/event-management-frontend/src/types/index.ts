// src/types/index.ts
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'cliente';
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'cliente';
}

export interface Event {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  lugar: string;
  precio: number;
  capacidad: number;
  disponibles: number;
}

export interface EventFormData {
  nombre: string;
  fecha: string;
  lugar: string;
  precio: number;
  capacidad: number;
}

export interface Purchase {
  id: number;
  usuario_id: number;
  id_evento: number; // Cambiado de `evento_id` a `id_evento`
  cantidad: number;
  precio_total: number;
  fecha_compra: string;
  estado: 'pendiente' | 'pagado' | 'cancelado';
  evento?: Event;
}

export interface PurchaseRequest {
  id_evento: number; // Cambiado de `evento_id` a `id_evento`
  cantidad: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}