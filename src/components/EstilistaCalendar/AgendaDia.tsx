import React, { useEffect, useState } from 'react';
import logo from '../../assets/img/logo.png';
import homeIcon from '../../assets/img/home.png';
import calendarIcon from '../../assets/img/calendar.png';
import userIcon from '../../assets/img/user.png';
import { getAgendaDia, actualizarEstadoCitaEstilista } from '../../services/estilistaApi';
import { Estilista } from '../../types/estilista.types';
import './AgendaDia.css';

interface Props {
  estilista: Estilista;
  fecha: string;
  onVolver: () => void;
  onLogout: () => void;
  onPerfil: () => void;
}

const AgendaDia: React.FC<Props> = ({ estilista, fecha, onVolver, onLogout, onPerfil }) => {
  const [citas, setCitas]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actualizandoId, setActualizandoId] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState('');

  const nombreCompleto = `${estilista.nombre} ${estilista.apellidos}`;

  const cargarAgenda = () => {
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
  };

  useEffect(() => {
    cargarAgenda();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estilista.id, fecha]);

  const estadoClass = (estado: string) => {
    if (!estado) return 'badge-confirmada';
    const e = estado.toLowerCase();
    if (e === 'confirmada') return 'badge-confirmada';
    if (e === 'cancelada')  return 'badge-cancelada';
    if (e === 'finalizada') return 'badge-finalizada';
    return 'badge-pendiente';
  };

  const cambiarEstado = async (citaId: number, nuevoEstado: string) => {
    setActualizandoId(citaId);
    setMensaje('');
    try {
      await actualizarEstadoCitaEstilista(citaId, nuevoEstado);
      setMensaje(`Cita marcada como ${nuevoEstado.toLowerCase()}.`);
      cargarAgenda();
    } catch {
      setMensaje('No se pudo actualizar la cita.');
    } finally {
      setActualizandoId(null);
    }
  };

  return (
    <div className="agenda-screen">

      <header className="cal-header">
        <img src={logo} alt="Mi Peluquería Virtual" className="cal-logo" />
        <div className="cal-header-right">
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

        {mensaje && <div className="agenda-mensaje">{mensaje}</div>}

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
            {citas.map((cita, idx) => {
              const estado = (cita.estado || '').toUpperCase();
              const puedeActuar = estado !== 'CANCELADA' && estado !== 'FINALIZADA';
              return (
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
                  {puedeActuar && (
                    <div className="agenda-item-actions">
                      <button
                        className="agenda-btn-finalizar"
                        disabled={actualizandoId === cita.id}
                        onClick={() => cambiarEstado(cita.id, 'FINALIZADA')}
                      >
                        Finalizar
                      </button>
                      <button
                        className="agenda-btn-cancelar"
                        disabled={actualizandoId === cita.id}
                        onClick={() => cambiarEstado(cita.id, 'CANCELADA')}
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <nav className="bottom-nav">
        <div className="nav-item nav-active" onClick={onVolver}>
          <img src={calendarIcon} alt="Calendario" className="nav-icon-img nav-icon-active" /><span>Calendario</span>
        </div>
        <div className="nav-item" onClick={onPerfil}>
          <img src={userIcon} alt="Perfil" className="nav-icon-img" /><span>Perfil</span>
        </div>
      </nav>
    </div>
  );
};

export default AgendaDia;