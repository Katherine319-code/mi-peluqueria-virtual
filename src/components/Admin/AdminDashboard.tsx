import React, { useEffect, useState } from 'react';
import { Cita, Estilista, Servicio, Usuario } from '../../types';
import {
  actualizarEstadoCita,
  crearEstilista,
  crearServicio,
  listarEstilistas,
  listarServicios,
  listarTodasLasCitas,
} from '../../services/api';
import logo from '../../assets/img/logo.png';
import './AdminDashboard.css';

interface Props {
  user: Usuario;
  onLogout: () => void;
}

const AdminDashboard: React.FC<Props> = ({ user, onLogout }) => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [estilistas, setEstilistas] = useState<Estilista[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [servicioForm, setServicioForm] = useState({ nombre: '', descripcion: '', precio: 0, duracion: 45 });
  const [estilistaForm, setEstilistaForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    especialidad: '',
  });

  const cargarDatos = async () => {
    const [serviciosData, estilistasData, citasData] = await Promise.all([
      listarServicios(),
      listarEstilistas(),
      listarTodasLasCitas(),
    ]);
    setServicios(serviciosData);
    setEstilistas(estilistasData);
    setCitas(citasData);
  };

  useEffect(() => {
    cargarDatos().catch(() => setMensaje('No se pudo cargar la informacion del administrador.'));
  }, []);

  const guardarServicio = async (event: React.FormEvent) => {
    event.preventDefault();
    await crearServicio({ ...servicioForm });
    setServicioForm({ nombre: '', descripcion: '', precio: 0, duracion: 45 });
    setMensaje('Servicio creado correctamente.');
    cargarDatos();
  };

  const guardarEstilista = async (event: React.FormEvent) => {
    event.preventDefault();
    await crearEstilista(estilistaForm);
    setEstilistaForm({ nombre: '', apellido: '', correo: '', password: '', especialidad: '' });
    setMensaje('Estilista creado correctamente.');
    cargarDatos();
  };

  const cambiarEstado = async (cita: Cita, estado: Cita['estado']) => {
    await actualizarEstadoCita(cita.id, estado);
    setMensaje(`Cita marcada como ${estado.toLowerCase()}.`);
    cargarDatos();
  };

  return (
    <div className="admin-screen">
      <header className="admin-header">
        <img src={logo} alt="Mi Peluqueria Virtual" />
        <div>
          <strong>{user.nombres} {user.apellidos}</strong>
          <button onClick={onLogout}>Salir</button>
        </div>
      </header>

      <main className="admin-content">
        <section className="admin-title-row">
          <div>
            <p>Panel administrador</p>
            <h1>Gestion de peluqueria</h1>
          </div>
          {mensaje && <span className="admin-message">{mensaje}</span>}
        </section>

        <section className="admin-stats">
          <div><span>{servicios.length}</span><p>Servicios</p></div>
          <div><span>{estilistas.length}</span><p>Estilistas</p></div>
          <div><span>{citas.length}</span><p>Citas</p></div>
        </section>

        <section className="admin-grid">
          <form className="admin-panel" onSubmit={guardarServicio}>
            <h2>Nuevo servicio</h2>
            <input placeholder="Nombre" value={servicioForm.nombre} onChange={e => setServicioForm({ ...servicioForm, nombre: e.target.value })} required />
            <input placeholder="Descripcion" value={servicioForm.descripcion} onChange={e => setServicioForm({ ...servicioForm, descripcion: e.target.value })} required />
            <div className="admin-two-cols">
              <input type="number" placeholder="Precio" value={servicioForm.precio || ''} onChange={e => setServicioForm({ ...servicioForm, precio: Number(e.target.value) })} required />
              <input type="number" placeholder="Minutos" value={servicioForm.duracion} onChange={e => setServicioForm({ ...servicioForm, duracion: Number(e.target.value) })} required />
            </div>
            <button>Crear servicio</button>
          </form>

          <form className="admin-panel" onSubmit={guardarEstilista}>
            <h2>Nuevo estilista</h2>
            <div className="admin-two-cols">
              <input placeholder="Nombre" value={estilistaForm.nombre} onChange={e => setEstilistaForm({ ...estilistaForm, nombre: e.target.value })} required />
              <input placeholder="Apellido" value={estilistaForm.apellido} onChange={e => setEstilistaForm({ ...estilistaForm, apellido: e.target.value })} required />
            </div>
            <input type="email" placeholder="Correo" value={estilistaForm.correo} onChange={e => setEstilistaForm({ ...estilistaForm, correo: e.target.value })} required />
            <input type="password" placeholder="Contrasena inicial" value={estilistaForm.password} onChange={e => setEstilistaForm({ ...estilistaForm, password: e.target.value })} required />
            <input placeholder="Especialidad" value={estilistaForm.especialidad} onChange={e => setEstilistaForm({ ...estilistaForm, especialidad: e.target.value })} required />
            <button>Crear estilista</button>
          </form>
        </section>

        <section className="admin-panel admin-table-panel">
          <h2>Agenda general</h2>
          <div className="admin-table">
            {citas.map(cita => (
              <div className="admin-row" key={cita.id}>
                <div>
                  <strong>{cita.servicio.nombre}</strong>
                  <span>{cita.clienteNombre} con {cita.estilista}</span>
                </div>
                <span>{cita.fecha} {cita.hora}</span>
                <span>{cita.estado}</span>
                <div className="admin-actions">
                  <button onClick={() => cambiarEstado(cita, 'FINALIZADA')}>Finalizar</button>
                  <button onClick={() => cambiarEstado(cita, 'CANCELADA')}>Cancelar</button>
                </div>
              </div>
            ))}
            {citas.length === 0 && <p className="admin-empty">Aun no hay citas registradas.</p>}
          </div>
        </section>

        <section className="admin-panel admin-table-panel">
          <h2>Servicios activos</h2>
          <div className="admin-list">
            {servicios.map(servicio => (
              <span key={servicio.id}>{servicio.nombre} · ${servicio.precio.toLocaleString('es-CO')} · {servicio.duracion} min</span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
