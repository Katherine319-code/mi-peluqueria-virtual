export interface Estilista {
  id: number;
  nombre: string;
  apellidos: string;
  correo: string;
  activo: boolean;
}

export interface CitaAgenda {
  id: number;
  hora: string;
  servicioNombre: string;
  estilista: string;
  fecha: string;
  estado: string;
  metodoPago: string;
  duracion: number;

}

