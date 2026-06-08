import axios from 'axios';
import { Estilista } from '../types/estilista.types';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

export const loginEstilista = async (
  correo: string,
  contrasena: string
): Promise<Estilista> => {
  const { data } = await api.post<Estilista>('/api/estilistas/login', {
    correo,
    contrasena,
  });
  return data;
};

export const getAgendaDia = async (
  estilistaId: number,
  fecha: string
): Promise<any[]> => {
  const fechaISO = toISO(fecha);
  const { data } = await api.get('/api/estilistas/agenda/dia', {
    params: { estilistaId, fecha: fechaISO },
  });
  return data;
};

export const getAgendaMes = async (
  estilistaId: number,
  mes: string,
  anio: string
): Promise<string[]> => {
  const { data } = await api.get<string[]>('/api/estilistas/agenda/mes', {
    params: { estilistaId, mes: Number(mes), anio: Number(anio) },
  });
  return data;
};

function toISO(fecha: string): string {
  if (!fecha) return fecha;
  if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha;
  const [d, m, y] = fecha.split('/');
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}