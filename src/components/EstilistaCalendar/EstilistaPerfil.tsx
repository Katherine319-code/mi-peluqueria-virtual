import React from 'react';
import { Estilista } from '../../types/estilista.types';
import logo from '../../assets/img/logo.png';
import calendarIcon from '../../assets/img/calendar.png';
import userIcon from '../../assets/img/user.png';
import './EstilistaPerfil.css';

interface Props {
  estilista: Estilista;
  onVolverCalendario: () => void;
  onLogout: () => void;
}

const EstilistaPerfil: React.FC<Props> = ({ estilista, onVolverCalendario, onLogout }) => {
  const nombreCompleto = `${estilista.nombre} ${estilista.apellidos}`;
  const initials = (estilista.nombre?.[0] || 'E') + (estilista.apellidos?.[0] || 'S');

  return (
    <div className="est-perfil-screen">
      <header className="cal-header">
        <img src={logo} alt="Mi Peluquería Virtual" className="cal-logo" />
        <div className="cal-header-right">
          <span className="cal-estilista-name">{nombreCompleto}</span>
        </div>
      </header>

      <div className="est-perfil-content">
        <div className="avatar-circle avatar-large">{initials.toUpperCase()}</div>
        <h2 className="est-perfil-name">{nombreCompleto}</h2>

        <div className="est-perfil-card">
          <div className="est-perfil-field">
            <span className="est-perfil-label">Correo</span>
            <span className="est-perfil-value">{estilista.correo}</span>
          </div>
        </div>

        <button className="est-perfil-logout-btn" onClick={onLogout}>
          Cerrar sesion
        </button>
      </div>

      <nav className="bottom-nav">
        <div className="nav-item" onClick={onVolverCalendario}>
          <img src={calendarIcon} alt="Calendario" className="nav-icon-img" /><span>Calendario</span>
        </div>
        <div className="nav-item nav-active">
          <img src={userIcon} alt="Perfil" className="nav-icon-img nav-icon-active" /><span>Perfil</span>
        </div>
      </nav>
    </div>
  );
};

export default EstilistaPerfil;