import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/logo.png';
import homeIcon from '../../assets/img/home.png';
import calendarIcon from '../../assets/img/calendar.png';
import userIcon from '../../assets/img/user.png';
import { getAgendaDia } from '../../services/estilistaApi';
import { Estilista } from '../../types/estilista.types';
import './AgendaDia.css';

interface Props {
  estilista: Estilista;
  fecha: string;          
  onVolver: () => void;
  onLogout: () => void;
}

const AgendaDia: React.FC<Props> = ({ estilista, fecha, onVolver, onLogout }) => {
  const [citas, setCitas]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const nombreCompleto = `${estilista.nombre} ${estilista.apellidos}`;

  useEffect(() => {
    setLoading(true);

    getAgendaDia(estilista.id, fecha)
      .then(data => {
        const ordenadas = [...data].sort((a, b) =>
          (a.hora || '').localeCompare(b.hora || '')
        );
        setCitas(ordenadas);
      })
      .catch(() => setCitas([]))
      .finally(() => setLoading(false));
  }, [estilista.id, fecha]);

  const estadoClass = (estado: string) => {
    if (!estado) return 'badge-confirmada';
    const e = estado.toLowerCase();
    if (e === 'confirmada') return 'badge-confirmada';
    if (e === 'cancelada')  return 'badge-cancelada';
    return 'badge-pendiente';
  };

  return (
    <div className="agenda-screen">
   
      <header className="cal-header">
        <img src={logo} alt="Mi Peluquería Virtual" className="cal-logo" />
        <div className="cal-header-right">
          <div className="search-bar-inline">
            <span className="search-icon">🔍</span>
            <input placeholder="Buscar servicios, clientes, citas..." />
          </div>
          <span className="cal-estilista-name">{nombreCompleto}</span>
        </div>
      </header>

      <div className="agenda-body">
       
        <div className="agenda-top">
          <h2 className="agenda-title">Agenda del día</h2>
          <div className="fecha-chip" onClick={onVolver}>
            ← {fecha}
          </div>
        </div>

        {loading ? (
          <div className="agenda-loading">Cargando citas...</div>
        ) : citas.length === 0 ? (
          <div className="agenda-empty">
            <span style={{ fontSize: 40 }}>📅</span>
            <p>No hay citas para este día</p>
            <button className="btn-volver" onClick={onVolver}>Ver otro día</button>
          </div>
        ) : (
          <div className="agenda-lista">
            {citas.map((cita, idx) => (
              <div className="agenda-item" key={cita.id || idx}>
                <span className="agenda-hora">{cita.hora || '--:--'}</span>
                <div className="agenda-info">
                  <span className="agenda-servicio">
                    {cita.servicioNombre || cita.servicio || 'Servicio'}
                  </span>
                  <span className="agenda-cliente">
                    {cita.clienteNombre || 'Cliente'}
                  </span>
                </div>
                <span className={`agenda-badge ${estadoClass(cita.estado)}`}>
                  {cita.estado || 'Pendiente'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <nav className="bottom-nav">
        <div className="nav-item" onClick={onLogout}>
          <img src={homeIcon} alt="Inicio" className="nav-icon-img" /><span>Inicio</span>
        </div>
        <div className="nav-item nav-active" onClick={onVolver}>
          <img src={calendarIcon} alt="Calendario" className="nav-icon-img nav-icon-active" /><span>Calendario</span>
        </div>
        <div className="nav-item" onClick={onLogout}>
          <img src={userIcon} alt="Perfil" className="nav-icon-img" /><span>Perfil</span>
        </div>
      </nav>
    </div>
  );
};

export default AgendaDia;