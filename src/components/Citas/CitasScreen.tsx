// CitasScreen.tsx
import React from 'react';
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

const CitasScreen: React.FC<Props> = ({ citas, justConfirmed, onNavigate, onCancelar }) => (
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

      {citas.length === 0 ? (
        <div className="empty-state">
          <p className="empty-text">No tienes citas programadas.</p>
          <button className="btn-reservar-citas" onClick={() => onNavigate('services')}>
            Reservar un servicio
          </button>
        </div>
      ) : (
        citas.map(cita => (
          <div className="cita-card" key={cita.id}>
            <div className="cita-header">
              <span className="cita-nombre">{cita.servicio.nombre}</span>
              <span className="badge-confirmada">{cita.estado}</span>
            </div>
            <p className="cita-info">👤 {cita.estilista}</p>
            <p className="cita-info">📅 {cita.fecha} &nbsp; ⏰ {cita.hora}</p>
            <p className="cita-info">⏱ {cita.servicio.duracion} min &nbsp;|&nbsp; 💳 {cita.metodoPago}</p>
            <div className="cita-footer">
              <button className="btn-cancelar-cita" onClick={() => onCancelar(cita.id)}>
                Cancelar cita
              </button>
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

export default CitasScreen;
