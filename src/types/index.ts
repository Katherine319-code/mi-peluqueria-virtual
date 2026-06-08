export type Rol = 'CLIENTE' | 'ESTILISTA' | 'ADMIN';

export interface Usuario {
  id?: number;
  nombres: string;
  apellidos: string;
  cedula?: string;
  correo: string;
  contrasena?: string;
  token?: string;
  rol?: Rol;
}

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  correo: string;
  nombre: string;
  apellido: string;
  rol: Rol;
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number;
  rating: number;
  categoria: 'Corte' | 'Tinte' | 'Manicure' | 'Otro';
}

export interface Estilista {
  id: number;
  usuarioId?: number;
  nombre: string;
  apellido?: string;
  apellidos: string;
  correo: string;
  especialidad?: string;
  experiencia?: number;
  activo: boolean;
  disponible?: boolean;
}

export interface Cita {
  id: number;
  servicio: Servicio;
  estilista: string;
  estilistaId?: number;
  clienteId?: number;
  clienteNombre?: string;
  fecha: string;
  hora: string;
  metodoPago: string;
  estado: 'CONFIRMADA' | 'PENDIENTE' | 'CANCELADA' | 'FINALIZADA';
}

export type Screen =
  | 'auth'
  | 'home'
  | 'services'
  | 'booking'
  | 'payment'
  | 'citas'
  | 'admin'
  | 'estilista-login'
  | 'estilista-calendario'
  | 'estilista-agenda-dia';
