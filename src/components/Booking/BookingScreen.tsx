// BookingScreen.tsx
import React, { useEffect, useState } from 'react';
import { Servicio, Cita, Screen, Estilista } from '../../types';
import { listarEstilistas } from '../../services/api';
import logo from '../../assets/img/logo.png';
import homeIcon from '../../assets/img/home.png';
import calendarIcon from '../../assets/img/calendar.png';
import servicesIcon from '../../assets/img/services.png';
import userIcon from '../../assets/img/user.png';
import './BookingScreen.css';

interface Props {
  servicio: Servicio;
  onNavigate: (screen: Screen) => void;
  onConfirm: (cita: Omit<Cita, 'id' | 'estado'> & { estilistaId: number }) => void;
}

const ESTILISTAS_FALLBACK: Estilista[] = [
  { id: 1, nombre: 'Hannah', apellido: 'Garcia', apellidos: 'Garcia', correo: 'hannah@peluqueria.com', activo: true },
  { id: 2, nombre: 'Sofia', apellido: 'Martinez', apellidos: 'Martinez', correo: 'sofia@peluqueria.com', activo: true },
];

const BookingScreen: React.FC<Props> = ({ servicio, onNavigate, onConfirm }) => {
const hoy = new Date().toISOString().slice(0, 10);
const [estilistas, setEstilistas] = useState<Estilista[]>(ESTILISTAS_FALLBACK);
const [estilistaId, setEstilistaId] = useState(ESTILISTAS_FALLBACK[0].id);
const [fecha, setFecha] = useState(hoy);
const [hora, setHora] = useState('14:00');

  useEffect(() => {
    listarEstilistas().then(data => {
      const activos = data.filter(e => e.activo);
      if (activos.length > 0) {
        setEstilistas(activos);
        setEstilistaId(activos[0].id);
      }
    }).catch(() => setEstilistas(ESTILISTAS_FALLBACK));
  }, []);

  const handleConfirmar = () => {
    const estilista = estilistas.find(e => e.id === estilistaId) || estilistas[0];
    const nombreCompleto = `${estilista.nombre} ${estilista.apellido || estilista.apellidos || ''}`.trim();
    onConfirm({ servicio, estilista: nombreCompleto, estilistaId: estilista.id, fecha, hora, metodoPago: 'EFECTIVO' });
    onNavigate('payment');
  };

  return (
    <div className="booking-screen">

      <header className="auth-header">
        <img src={logo} alt="Mi Peluquería Virtual" />
      </header>

      <div className="booking-search-bar">
        <input className="booking-search-input" placeholder="Buscar servicios..." />
      </div>

      <div className="booking-body">

        <div className="booking-left">
          <p className="booking-label">Servicio Seleccionado</p>
          <div className="selected-card">
            <div className="selected-row">
              <span className="sel-name">{servicio.nombre}</span>
              <span className="sel-price">${servicio.precio.toLocaleString('es-CO')}</span>
            </div>
            <p className="sel-meta">Duracion: &nbsp;&nbsp; {servicio.duracion} min</p>
          </div>

          <div className="booking-field">
            <label>Fecha</label>
            <div className="input-with-icon">
              <input
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
              />
            </div>
          </div>

          <div className="booking-field">
            <label>Hora</label>
            <div className="select-with-arrow">
              <select value={hora} onChange={e => setHora(e.target.value)}>
                {['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00'].map(h =>
                  <option key={h}>{h}</option>
                )}
              </select>
              <span className="field-icon">∨</span>
            </div>
          </div>
        </div>

        <div className="booking-right">
          <div className="booking-field">
            <label>Estilista</label>
            <div className="select-with-arrow">
              <select value={estilistaId} onChange={e => setEstilistaId(Number(e.target.value))}>
                {estilistas.map(e => (
                  <option key={e.id} value={e.id}>
                    {`${e.nombre} ${e.apellido || e.apellidos || ''}`.trim()}
                  </option>
                ))}
              </select>
              <span className="field-icon">∨</span>
            </div>
          </div>

          <div className="action-btns">
            <button className="btn-outline-pink" onClick={() => onNavigate('services')}>
              Cancelar
            </button>
            <button className="btn-outline-pink">
              Modificar
            </button>
            <button className="btn-confirm" onClick={handleConfirmar}>
              Confirmar
            </button>
          </div>
        </div>
      </div>

      <nav className="bottom-nav">
        <div className="nav-item" onClick={() => onNavigate('home')}>
          <img src={homeIcon} alt="Inicio" className="nav-icon-img" />
          <span>Inicio</span>
        </div>
        <div className="nav-item" onClick={() => onNavigate('citas')}>
          <img src={calendarIcon} alt="Citas" className="nav-icon-img" />
          <span>Citas</span>
        </div>
        <div className="nav-item nav-active" onClick={() => onNavigate('services')}>
          <img src={servicesIcon} alt="Servicios" className="nav-icon-img nav-icon-active" />
          <span>Servicios</span>
        </div>
        <div className="nav-item" onClick={() => onNavigate('auth')}>
          <img src={userIcon} alt="Perfil" className="nav-icon-img" />
          <span>Perfil</span>
        </div>
      </nav>
    </div>
  );
};

export default BookingScreen;
