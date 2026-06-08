import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/logo.png';
import homeIcon from '../../assets/img/home.png';
import calendarIcon from '../../assets/img/calendar.png';
import userIcon from '../../assets/img/user.png';
import { getAgendaMes } from '../../services/estilistaApi';
import { Estilista } from '../../types/estilista.types';
import './CalendarioMes.css';

interface Props {
  estilista: Estilista;
  onDiaClick: (fecha: string) => void;
  onLogout: () => void;
}

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS  = ['LUN','MAR','MIÉ','JUE','VIE','SÁB','DOM'];

const CalendarioMes: React.FC<Props> = ({ estilista, onDiaClick, onLogout }) => {
  const hoy   = new Date();
  const [mes,  setMes]  = useState(hoy.getMonth());
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [fechasConCitas, setFechasConCitas] = useState<string[]>([]);

  const nombreCompleto = `${estilista.nombre} ${estilista.apellidos}`;

  useEffect(() => {
    const m = String(mes + 1).padStart(2, '0');
    const a = String(anio);
    getAgendaMes(estilista.id, m, a)
      .then(setFechasConCitas)
      .catch(() => setFechasConCitas([]));
  }, [mes, anio, estilista.id]);

  const primerDia     = new Date(anio, mes, 1);
  const ultimoDia     = new Date(anio, mes + 1, 0).getDate();
  let   inicioOffset  = primerDia.getDay() - 1;
  if (inicioOffset < 0) inicioOffset = 6; // domingo → posición 6

  const celdas: (number | null)[] = [
    ...Array(inicioOffset).fill(null),
    ...Array.from({ length: ultimoDia }, (_, i) => i + 1),
  ];
  while (celdas.length % 7 !== 0) celdas.push(null);

  const tieneCita = (dia: number) => {
    const mm  = String(mes + 1).padStart(2, '0');
    const dd  = String(dia).padStart(2, '0');
    const iso = `${anio}-${mm}-${dd}`;
    return fechasConCitas.includes(iso);
  };

  const handleDia = (dia: number) => {
    const dd = String(dia).padStart(2, '0');
    const mm = String(mes + 1).padStart(2, '0');
    onDiaClick(`${dd}/${mm}/${anio}`);
  };

  const anterior = () => {
    if (mes === 0) { setMes(11); setAnio(a => a - 1); }
    else setMes(m => m - 1);
  };

  const siguiente = () => {
    if (mes === 11) { setMes(0); setAnio(a => a + 1); }
    else setMes(m => m + 1);
  };

  return (
    <div className="cal-screen">
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

      <div className="cal-body">
        <h2 className="cal-section-title">Agenda del mes</h2>

        <div className="cal-content">
          <div className="cal-mes-panel">
            <button className="nav-arrow" onClick={anterior}>‹</button>
            <div className="cal-mes-info">
              <span className="cal-mes-nombre">{MESES[mes].toUpperCase()}</span>
              <span className="cal-anio">{anio}</span>
            </div>
            <button className="nav-arrow" onClick={siguiente}>›</button>
          </div>

          <div className="cal-grid-wrap">
            <div className="cal-grid">
              {DIAS.map((d, i) => (
                <div key={d} className={`cal-dia-header ${i >= 5 ? 'weekend' : ''}`}>{d}</div>
              ))}

              {celdas.map((dia, idx) => {
                const col          = idx % 7;
                const esFinDeSemana = col >= 5;
                const tieneAppt    = dia ? tieneCita(dia) : false;
                return (
                  <div
                    key={idx}
                    className={`cal-dia-celda ${dia ? 'activa' : ''} ${esFinDeSemana ? 'weekend' : ''} ${tieneAppt ? 'con-cita' : ''}`}
                    onClick={() => dia && handleDia(dia)}
                  >
                    {dia || ''}
                    {tieneAppt && <span className="cita-dot"></span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <nav className="bottom-nav">
        <div className="nav-item" onClick={onLogout}>
          <img src={homeIcon} alt="Inicio" className="nav-icon-img" /><span>Inicio</span>
        </div>
        <div className="nav-item nav-active">
          <img src={calendarIcon} alt="Calendario" className="nav-icon-img nav-icon-active" /><span>Calendario</span>
        </div>
        <div className="nav-item" onClick={onLogout}>
          <img src={userIcon} alt="Perfil" className="nav-icon-img" /><span>Perfil</span>
        </div>
      </nav>
    </div>
  );
};

export default CalendarioMes;

