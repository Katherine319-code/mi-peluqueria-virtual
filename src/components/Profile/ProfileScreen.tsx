import React from 'react';
import { Usuario, Screen } from '../../types';
import logo from '../../assets/img/logo.png';
import homeIcon from '../../assets/img/home.png';
import calendarIcon from '../../assets/img/calendar.png';
import servicesIcon from '../../assets/img/services.png';
import userIcon from '../../assets/img/user.png';
import './ProfileScreen.css';

interface Props {
  user: Usuario;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

const ProfileScreen: React.FC<Props> = ({ user, onNavigate, onLogout }) => {
  const initials = (user.nombres?.[0] || 'M') + (user.apellidos?.[0] || 'P');

  return (
    <div className="profile-screen">
      <header className="auth-header">
        <img src={logo} alt="Mi Peluqueria Virtual" />
      </header>

      <div className="profile-content">
        <div className="avatar-circle avatar-large">{initials.toUpperCase()}</div>
        <h2 className="profile-name">{user.nombres} {user.apellidos}</h2>

        <div className="profile-card">
          <div className="profile-field">
            <span className="profile-label">Correo</span>
            <span className="profile-value">{user.correo}</span>
          </div>
          {user.cedula && (
            <div className="profile-field">
              <span className="profile-label">Cedula</span>
              <span className="profile-value">{user.cedula}</span>
            </div>
          )}
        </div>

        <button className="profile-logout-btn" onClick={onLogout}>
          Cerrar sesion
        </button>
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
        <div className="nav-item" onClick={() => onNavigate('services')}>
          <img src={servicesIcon} alt="Servicios" className="nav-icon-img" />
          <span>Servicios</span>
        </div>
        <div className="nav-item nav-active" onClick={() => onNavigate('profile')}>
          <img src={userIcon} alt="Perfil" className="nav-icon-img nav-icon-active" />
          <span>Perfil</span>
        </div>
      </nav>
    </div>
  );
};

export default ProfileScreen;
