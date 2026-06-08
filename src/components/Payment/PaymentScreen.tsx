import React, { useState } from 'react';
import { Cita, Screen } from '../../types';
import logo from '../../assets/img/logo.png';
import cashIcon from '../../assets/img/cash.png';
import bankIcon from '../../assets/img/bank.png';
import homeIcon from '../../assets/img/home.png';
import calendarIcon from '../../assets/img/calendar.png';
import servicesIcon from '../../assets/img/services.png';
import userIcon from '../../assets/img/user.png';
import './PaymentScreen.css';

interface Props {
  cita: Omit<Cita, 'id' | 'estado'>;
  onNavigate: (screen: Screen) => void;
  onPagar: (metodo: string) => void;
}

const PaymentScreen: React.FC<Props> = ({ cita, onNavigate, onPagar }) => {
  const [metodo, setMetodo] = useState<'EFECTIVO' | 'PSE'>('EFECTIVO');

  return (
    <div className="payment-screen">

      <header className="auth-header">
        <img src={logo} alt="Mi Peluquería Virtual" />
      </header>

      <div className="payment-search-bar">
        <input className="payment-search-input" placeholder="Buscar servicios..." />
      </div>

      <div className="payment-body">

        <div className="payment-left">
          <p className="pay-section-title">Resumen de tu cita</p>
          <div className="summary-card">
            <div className="summary-row"><span>Servicio:</span><span>{cita.servicio.nombre} de cabello</span></div>
            <div className="summary-row"><span>Estilista:</span><span>{cita.estilista}</span></div>
            <div className="summary-row"><span>Fecha:</span><span>{cita.fecha}</span></div>
            <div className="summary-row"><span>Hora:</span><span>{cita.hora}</span></div>
            <div className="summary-row"><span>Duracion:</span><span>{cita.servicio.duracion} min</span></div>
            <div className="summary-row total-row">
              <span>Total a pagar:</span>
              <span className="total-price">${cita.servicio.precio.toLocaleString('es-CO')}</span>
            </div>
          </div>
        </div>

        <div className="payment-right">
          <p className="pay-section-title">Metodo de pago</p>

          <div
            className={`pay-option ${metodo === 'EFECTIVO' ? 'pay-selected' : ''}`}
            onClick={() => setMetodo('EFECTIVO')}
          >
            <img src={cashIcon} alt="Efectivo" className="pay-img" />
            <div>
              <div className="pay-name">Efectivo</div>
              <div className="pay-sub">Paga al llegar al establecimiento</div>
            </div>
          </div>

          <div
            className={`pay-option ${metodo === 'PSE' ? 'pay-selected' : ''}`}
            onClick={() => setMetodo('PSE')}
          >
            <img src={bankIcon} alt="Bancos" className="pay-img" />
            <div>
              <div className="pay-name">PSE</div>
              <div className="pay-sub">Paga por PSE</div>
            </div>
          </div>

          <div className="pay-btns">
            <button className="btn-cancel-pay" onClick={() => onNavigate('booking')}>Cancelar</button>
            <button className="btn-pay" onClick={() => onPagar(metodo)}>Pagar</button>
          </div>
        </div>
      </div>

      <nav className="bottom-nav">
        <div className="nav-item" onClick={() => onNavigate('home')}>
          <img src={homeIcon} alt="Inicio" className="nav-icon-img" /><span>Inicio</span>
        </div>
        <div className="nav-item" onClick={() => onNavigate('citas')}>
          <img src={calendarIcon} alt="Citas" className="nav-icon-img" /><span>Citas</span>
        </div>
        <div className="nav-item nav-active" onClick={() => onNavigate('services')}>
          <img src={servicesIcon} alt="Servicios" className="nav-icon-img nav-icon-active" /><span>Servicios</span>
        </div>
        <div className="nav-item" onClick={() => onNavigate('auth')}>
          <img src={userIcon} alt="Perfil" className="nav-icon-img" /><span>Perfil</span>
        </div>
      </nav>
    </div>
  );
};

export default PaymentScreen;
