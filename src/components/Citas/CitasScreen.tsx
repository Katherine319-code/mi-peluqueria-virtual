// CitasScreen.tsx
import React, { useState } from 'react';
import { Cita, Screen } from '../../types';
import logo from '../../assets/img/logo.png';
import homeIcon from '../../assets/img/home.png';
import calendarIcon from '../../assets/img/calendar.png';
import servicesIcon from '../../assets/img/services.png';
import userIcon from '../../assets/img/user.png';
import './CitasScreen.css';

interface Props {
  citas: Cita[];
  justConfirmed: boolean;
  onNavigate: (screen: Screen) => void;
  onCancelar: (id: number) => void;
}

const ESTADOS_HISTORICOS: Cita['estado'][] = ['FINALIZADA', 'CANCELADA'];

const claseBadge = (estado: Cita['estado']) => {
  switch (estado) {
    case 'FINALIZADA': return 'badge-finalizada';
    case 'CANCELADA':  return 'badge-cancelada';
    case 'PENDIENTE':  return 'badge-pendiente';
    default:           return 'badge-confirmada';
  }
};

const fechaDeHoyISO = () => {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
};

// Una cita se considera "historica" si ya fue finalizada/cancelada,
// o si su fecha ya paso (aunque nadie haya actualizado su estado).
const esHistorica = (cita: Cita, hoy: string) =>
  ESTADOS_HISTORICOS.includes(cita.estado) || cita.fecha < hoy;

const CitasScreen: React.FC<Props> = ({ citas, justConfirmed, onNavigate, onCancelar }) => {
  const [tab, setTab] = useState<'proximas' | 'historial'>('proximas');
  const hoy = fechaDeHoyISO();

  const proximas = citas.filter(c => !esHistorica(c, hoy));
  const historial = citas.filter(c => esHistorica(c, hoy));
  const citasVisibles = tab === 'proximas' ? proximas : historial;

  return (
    <div className="citas-screen">

      <header className="auth-header">
        <img src={logo} alt="Mi Peluquería Virtual" />
      </header>

      <div className="citas-search-bar">
        <input className="citas-search-input" placeholder="Buscar citas..." />
      </div>

      <div className="citas-content">
        {justConfirmed && (
          <div className="success-banner">
            ✅ ¡Cita confirmada exitosamente! Te esperamos 💕
          </div>
        )}

        <h2 className="citas-title">Mis Citas</h2>

        <div className="citas-tab-row">
          <button
            className={`citas-tab ${tab === 'proximas' ? 'citas-tab-active' : ''}`}
            onClick={() => setTab('proximas')}
          >
            Proximas ({proximas.length})
          </button>
          <button
            className={`citas-tab ${tab === 'historial' ? 'citas-tab-active' : ''}`}
            onClick={() => setTab('historial')}
          >
            Historial ({historial.length})
          </button>
        </div>

        {citasVisibles.length === 0 ? (
          <div className="empty-state">
            <p className="empty-text">
              {tab === 'proximas' ? 'No tienes citas programadas.' : 'Aun no tienes citas en tu historial.'}
            </p>
            {tab === 'proximas' && (
              <button className="btn-reservar-citas" onClick={() => onNavigate('services')}>
                Reservar un servicio
              </button>
            )}
          </div>
        ) : (
          citasVisibles.map(cita => (
            <div className="cita-card" key={cita.id}>
              <div className="cita-header">
                <span className="cita-nombre">{cita.servicio.nombre}</span>
                <span className={claseBadge(cita.estado)}>{cita.estado}</span>
              </div>
              <p className="cita-info">👤 {cita.estilista}</p>
              <p className="cita-info">📅 {cita.fecha} &nbsp; ⏰ {cita.hora}</p>
              <p className="cita-info">⏱ {cita.servicio.duracion} min &nbsp;|&nbsp; 💳 {cita.metodoPago}</p>
              <div className="cita-footer">
                {tab === 'proximas' ? (
                  <button className="btn-cancelar-cita" onClick={() => onCancelar(cita.id)}>
                    Cancelar cita
                  </button>
                ) : (
                  <span />
                )}
                <span className="cita-price">${cita.servicio.precio.toLocaleString('es-CO')}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <nav className="bottom-nav">
        <div className="nav-item" onClick={() => onNavigate('home')}>
          <img src={homeIcon} alt="Inicio" className="nav-icon-img" /><span>Inicio</span>
        </div>
        <div className="nav-item nav-active" onClick={() => onNavigate('citas')}>
          <img src={calendarIcon} alt="Citas" className="nav-icon-img nav-icon-active" /><span>Citas</span>
        </div>
        <div className="nav-item" onClick={() => onNavigate('services')}>
          <img src={servicesIcon} alt="Servicios" className="nav-icon-img" /><span>Servicios</span>
        </div>
        <div className="nav-item" onClick={() => onNavigate('profile')}>
          <img src={userIcon} alt="Perfil" className="nav-icon-img" /><span>Perfil</span>
        </div>
      </nav>
    </div>
  );
};

export default CitasScreen;