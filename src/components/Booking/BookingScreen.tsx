// BookingScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
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

const HORAS_POSIBLES = ['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00'];

const fechaDeHoyISO = () => {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
};

const horaActualHHMM = () => {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};

const BookingScreen: React.FC<Props> = ({ servicio, onNavigate, onConfirm }) => {
  const hoy = fechaDeHoyISO();
  const [estilistas, setEstilistas] = useState<Estilista[]>(ESTILISTAS_FALLBACK);
  const [estilistaId, setEstilistaId] = useState(ESTILISTAS_FALLBACK[0].id);
  const [fecha, setFecha] = useState(hoy);
  const [hora, setHora] = useState('14:00');
  const [error, setError] = useState('');

  useEffect(() => {
    listarEstilistas().then(data => {
      const activos = data.filter(e => e.activo);
      if (activos.length > 0) {
        setEstilistas(activos);
        setEstilistaId(activos[0].id);
      }
    }).catch(() => setEstilistas(ESTILISTAS_FALLBACK));
  }, []);

  // Si la fecha elegida es hoy, solo se muestran horas que aun no han pasado.
  const horasDisponibles = useMemo(() => {
    if (fecha !== hoy) return HORAS_POSIBLES;
    const ahora = horaActualHHMM();
    return HORAS_POSIBLES.filter(h => h > ahora);
  }, [fecha, hoy]);

  // Si la hora seleccionada ya no es valida (por ejemplo, cambiaste a "hoy"
  // y esa hora ya paso), se ajusta automaticamente a la primera disponible.
  useEffect(() => {
    if (horasDisponibles.length > 0 && !horasDisponibles.includes(hora)) {
      setHora(horasDisponibles[0]);
    }
  }, [horasDisponibles, hora]);

  const handleFechaChange = (valor: string) => {
    setError('');
    if (valor < hoy) {
      setError('No puedes elegir una fecha que ya paso.');
      return;
    }
    setFecha(valor);
  };

  const handleConfirmar = () => {
    setError('');

    if (fecha < hoy) {
      setError('No puedes elegir una fecha que ya paso.');
      return;
    }
    if (fecha === hoy && hora <= horaActualHHMM()) {
      setError('Esa hora ya paso. Elige otra hora disponible.');
      return;
    }

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

          {error && <div className="booking-error">{error}</div>}

          <div className="booking-field">
            <label>Fecha</label>
            <div className="input-with-icon">
              <input
                type="date"
                value={fecha}
                min={hoy}
                onChange={e => handleFechaChange(e.target.value)}
              />
            </div>
          </div>

          <div className="booking-field">
            <label>Hora</label>
            <div className="select-with-arrow">
              <select value={hora} onChange={e => setHora(e.target.value)}>
                {horasDisponibles.length === 0 && <option value="">No hay horas disponibles hoy</option>}
                {horasDisponibles.map(h =>
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
            <button
              className="btn-confirm"
              onClick={handleConfirmar}
              disabled={horasDisponibles.length === 0}
            >
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
        <div className="nav-item" onClick={() => onNavigate('profile')}>
          <img src={userIcon} alt="Perfil" className="nav-icon-img" />
          <span>Perfil</span>
        </div>
      </nav>
    </div>
  );
};

export default BookingScreen;