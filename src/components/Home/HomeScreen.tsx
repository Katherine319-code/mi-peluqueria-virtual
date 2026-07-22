import React from 'react';
import { Usuario, Screen } from '../../types';
import logo from '../../assets/img/logo.png';
import homeIcon from '../../assets/img/home.png';
import calendarIcon from '../../assets/img/calendar.png';
import servicesIcon from '../../assets/img/services.png';
import userIcon from '../../assets/img/user.png';
import './HomeScreen.css';

interface Props { user: Usuario; onNavigate: (screen: Screen) => void; }

const HomeScreen: React.FC<Props> = ({ user, onNavigate }) => {
  const initials = (user.nombres?.[0] || 'M') + (user.apellidos?.[0] || 'P');

  return (
    <div className="home-screen">
      <header className="auth-header">
        <img src={logo} alt="Mi Peluqueria Virtual" />
      </header>

      <div className="home-search-bar">
        <input className="home-search-input" placeholder="Buscar" />
      </div>

      <div className="home-content">
        <div className="avatar-circle">{initials.toUpperCase()}</div>
        <h2 className="home-greeting">¡Hola, {user.nombres} {user.apellidos}!</h2>
        <p className="home-sub">Bienvenida a Mi Peluqueria virtual,<br />la belleza esta en tus manos...</p>
      </div>

      <nav className="bottom-nav">
        <div className="nav-item nav-active" onClick={() => onNavigate('home')}>
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
        <div className="nav-item" onClick={() => onNavigate('profile')}>
          <img src={userIcon} alt="Perfil" className="nav-icon-img" />
          <span>Perfil</span>
        </div>
      </nav>
    </div>
  );
};

export default HomeScreen;