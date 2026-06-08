import React, { useState } from 'react';
import logo from '../../assets/img/logo.png';
import { loginEstilista } from '../../services/estilistaApi';
import { Estilista } from '../../types/estilista.types';
import './EstilistaLogin.css';

interface Props {
  onLogin: (estilista: Estilista) => void;
  onVolver: () => void;
}

const EstilistaLogin: React.FC<Props> = ({ onLogin, onVolver }) => {
  const [correo, setCorreo]       = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!correo || !contrasena) { setError('Completa todos los campos'); return; }
    setLoading(true);
    try {
      const estilista = await loginEstilista(correo, contrasena);
      onLogin(estilista);
    } catch {
      setError('Correo o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="est-login-screen">
      <header className="auth-header">
        <img src={logo} alt="Mi Peluquería Virtual" />
      </header>

      <div className="est-login-body">
        <div className="est-login-card">
          <div className="est-login-icon"></div>
          <h2 className="est-login-title">Portal Estilistas</h2>
          <p className="est-login-sub">Ingresa con las credenciales proporcionadas por el administrador</p>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="field-group">
              <label>Correo</label>
              <input
                type="email"
                placeholder="hannah@peluqueria.com"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={contrasena}
                onChange={e => setContrasena(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-dark" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <div className="est-volver" onClick={onVolver}>
            ← Volver al inicio de clientes
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstilistaLogin;