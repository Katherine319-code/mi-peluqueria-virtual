import axios from 'axios';
import { AuthResponse, Cita, Estilista, LoginRequest, Servicio, Usuario } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

const mapServicio = (s: any): Servicio => ({
  id: Number(s.id),
  nombre: s.nombre,
  descripcion: s.descripcion || '',
  precio: Number(s.precio || 0),
  duracion: Number(s.duracionMinutos || s.duracion || 0),
  rating: Number(s.rating || 5),
  categoria: inferCategoria(s.nombre),
});

const mapCita = (c: any): Cita => ({
  id: Number(c.id),
  clienteId: c.clienteId,
  clienteNombre: c.clienteNombre,
  estilistaId: c.estilistaId,
  estilista: c.estilistaNombre || c.estilista || '',
  fecha: c.fecha,
  hora: String(c.hora || '').slice(0, 5),
  metodoPago: c.pagada ? 'PSE' : 'EFECTIVO',
  estado: c.estado,
  servicio: {
    id: Number(c.servicioId),
    nombre: c.servicioNombre,
    descripcion: '',
    precio: Number(c.servicioPrecio || c.total || 0),
    duracion: Number(c.servicioDuracion || 0),
    rating: 5,
    categoria: inferCategoria(c.servicioNombre),
  },
});

const inferCategoria = (nombre = ''): Servicio['categoria'] => {
  const value = nombre.toLowerCase();
  if (value.includes('tinte') || value.includes('tratamiento')) return 'Tinte';
  if (value.includes('manicure') || value.includes('uña') || value.includes('maquillaje')) return 'Manicure';
  if (value.includes('corte') || value.includes('barba')) return 'Corte';
  return 'Otro';
};

export const registrarUsuario = async (usuario: Omit<Usuario, 'id'>): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/api/auth/registro', {
    nombre: usuario.nombres,
    apellido: usuario.apellidos,
    correo: usuario.correo,
    password: usuario.contrasena,
    telefono: usuario.cedula,
  });
  return data;
};

export const loginUsuario = async (req: LoginRequest): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/api/auth/login', {
    correo: req.correo,
    password: req.contrasena,
  });
  return data;
};

export const listarServicios = async (): Promise<Servicio[]> => {
  const { data } = await api.get('/api/servicios');
  return data.map(mapServicio);
};

export const crearServicio = async (servicio: Omit<Servicio, 'id' | 'rating' | 'categoria'>): Promise<Servicio> => {
  const { data } = await api.post('/api/servicios', {
    nombre: servicio.nombre,
    descripcion: servicio.descripcion,
    precio: servicio.precio,
    duracionMinutos: servicio.duracion,
    activo: true,
  });
  return mapServicio(data);
};

export const listarEstilistas = async (): Promise<Estilista[]> => {
  const { data } = await api.get('/api/estilistas');
  return data.map((e: any) => ({ ...e, apellidos: e.apellidos || e.apellido || '' }));
};

export const crearEstilista = async (payload: {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  especialidad: string;
}): Promise<Estilista> => {
  const { data } = await api.post('/api/estilistas', payload);
  return { ...data, apellidos: data.apellidos || data.apellido || '' };
};

export const guardarCita = async (cita: {
  clienteId: number;
  estilistaId: number;
  fecha: string;
  hora: string;
  metodoPago: string;
  servicioId: number;
  total: number;
}): Promise<Cita> => {
  const { data } = await api.post('/api/citas', cita);
  return mapCita(data);
};

export const listarCitasCliente = async (clienteId: number): Promise<Cita[]> => {
  const { data } = await api.get(`/api/citas/cliente/${clienteId}`);
  return data.map(mapCita);
};

export const listarTodasLasCitas = async (): Promise<Cita[]> => {
  const { data } = await api.get('/api/citas');
  return data.map(mapCita);
};

export const actualizarEstadoCita = async (id: number, estado: Cita['estado']): Promise<Cita> => {
  const { data } = await api.put(`/api/citas/${id}/estado`, { estado });
  return mapCita(data);
};

export const cancelarCitaApi = async (id: number): Promise<void> => {
  await api.delete(`/api/citas/${id}`);
};

export const obtenerEstilistaPorUsuario = async (usuarioId: number): Promise<Estilista> => {
  const { data } = await api.get(`/api/estilistas/usuario/${usuarioId}`);
  return { ...data, apellidos: data.apellidos || data.apellido || '' };
};

export const loginConGoogle = async (idToken: string): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/api/auth/google', { token: idToken });
  return data;
};
