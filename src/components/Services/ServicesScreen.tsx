
import React, { useEffect, useState } from 'react';
import { Servicio, Screen } from '../../types';
import { listarServicios } from '../../services/api';
import logo from '../../assets/img/logo.png';
import homeIcon from '../../assets/img/home.png';
import calendarIcon from '../../assets/img/calendar.png';
import servicesIcon from '../../assets/img/services.png';
import userIcon from '../../assets/img/user.png';
import './ServicesScreen.css';

interface Props {
  onNavigate: (screen: Screen) => void;
  onSelectService: (service: Servicio) => void;
}

type Categoria = 'Todo' | 'Corte' | 'Tinte' | 'Manicure';

const SERVICIOS_FALLBACK: Servicio[] = [
  { id: 1, nombre: 'Corte',       descripcion: 'Estilismo personalizado', precio: 25000,  duracion: 45,  rating: 4.8, categoria: 'Corte'    },
  { id: 2, nombre: 'Manicure',    descripcion: 'Uñas con estilo',         precio: 15000,  duracion: 50,  rating: 4.9, categoria: 'Manicure' },
  { id: 3, nombre: 'Barba',       descripcion: 'Afeitado profesional',    precio: 18000,  duracion: 25,  rating: 5.0, categoria: 'Corte'    },
  { id: 4, nombre: 'Tratamiento', descripcion: 'Hidratacion y nutricion', precio: 80000,  duracion: 60,  rating: 5.0, categoria: 'Tinte'    },
  { id: 5, nombre: 'Tinte',       descripcion: 'Tecnica y color',         precio: 150000, duracion: 120, rating: 4.9, categoria: 'Tinte'    },
  { id: 6, nombre: 'Maquillaje',  descripcion: 'Belleza de impacto',      precio: 200000, duracion: 80,  rating: 4.9, categoria: 'Manicure' },
];

const ServicesScreen: React.FC<Props> = ({ onNavigate, onSelectService }) => {
  const [filter, setFilter] = useState<Categoria>('Todo');
  const [servicios, setServicios] = useState<Servicio[]>(SERVICIOS_FALLBACK);
  const filtered = filter === 'Todo' ? servicios : servicios.filter(s => s.categoria === filter);

  useEffect(() => {
    listarServicios().then(setServicios).catch(() => setServicios(SERVICIOS_FALLBACK));
  }, []);

  return (
    <div className="services-screen">
      <header className="auth-header">
        <img src={logo} alt="Mi Peluqueria Virtual" />
      </header>

      <div className="services-top-bar">
        <input className="services-search" placeholder="Buscar servicios..." />
        <div className="filter-row">
          {(['Corte', 'Tinte', 'Manicure', 'Todo'] as Categoria[]).map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'filter-active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="services-grid">
        {filtered.map(s => (
          <div className="service-card" key={s.id}>
            <div className="service-header">
              <span className="service-name">{s.nombre}</span>
              <span className="service-price">${s.precio.toLocaleString('es-CO')}</span>
            </div>
            <p className="service-desc">{s.descripcion}</p>
            <div className="service-meta">
              <span>⏱ {s.duracion} min</span>
              <span>⭐{s.rating}</span>
            </div>
            <button className="btn-reservar" onClick={() => { onSelectService(s); onNavigate('booking'); }}>
              Reservar
            </button>
          </div>
        ))}
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

export default ServicesScreen;
