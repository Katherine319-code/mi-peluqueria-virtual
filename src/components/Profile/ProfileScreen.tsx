import React, { useEffect, useState } from 'react';
import { Usuario, Screen } from '../../types';
import { obtenerUsuario, actualizarContacto } from '../../services/api';
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

  const [telefono, setTelefono] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user.id) return;
    obtenerUsuario(user.id)
      .then(data => {
        setTelefono(data.telefono || '');
        setWhatsapp(data.whatsapp || '');
      })
      .catch(() => {});
  }, [user.id]);

  const guardarContacto = async () => {
    if (!user.id) return;
    setGuardando(true);
    setError('');
    setMensaje('');
    try {
      await actualizarContacto(user.id, {
        nombre: user.nombres,
        apellido: user.apellidos,
        correo: user.correo,
        telefono,
        whatsapp,
      });
      setMensaje('Datos actualizados correctamente.');
      setEditando(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo actualizar la informacion.');
    } finally {
      setGuardando(false);
    }
  };

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

          <div className="profile-field">
            <span className="profile-label">Telefono</span>
            {editando ? (
              <input
                className="profile-input"
                type="tel"
                placeholder="Ej: 3001234567"
                value={telefono}
                onChange={e => setTelefono(e.target.value)}
              />
            ) : (
              <span className="profile-value">{telefono || 'No registrado'}</span>
            )}
          </div>

          <div className="profile-field">
            <span className="profile-label">WhatsApp</span>
            {editando ? (
              <input
                className="profile-input"
                type="tel"
                placeholder="Ej: 3001234567"
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
              />
            ) : (
              <span className="profile-value">{whatsapp || 'No registrado'}</span>
            )}
          </div>
        </div>

        {error && <div className="error-msg">{error}</div>}
        {mensaje && <div className="success-msg">{mensaje}</div>}

        {editando ? (
          <button className="profile-save-btn" onClick={guardarContacto} disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        ) : (
          <button className="profile-edit-btn" onClick={() => { setEditando(true); setMensaje(''); }}>
            Editar telefono y WhatsApp
          </button>
        )}

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

