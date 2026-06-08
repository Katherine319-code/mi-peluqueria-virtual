import React, { useState } from 'react';
import { Usuario, LoginRequest } from '../../types';
import { registrarUsuario, loginUsuario } from '../../services/api';
import './AuthScreen.css';
import logo from '../../assets/img/logo.png';
import google from '../../assets/img/google.png';

interface Props {
  onLogin: (user: Usuario) => void;
  onEstilistaPortal: () => void;
}

const AuthScreen: React.FC<Props> = ({ onLogin, onEstilistaPortal }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');

  const [loginData, setLoginData] = useState<LoginRequest>({ correo: '', contrasena: '' });

  const [regData, setRegData] = useState<Omit<Usuario, 'id'> & { confirmar: string }>({
    nombres: '', apellidos: '', cedula: '', correo: '', contrasena: '', confirmar: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginData.correo || !loginData.contrasena) { setError('Completa todos los campos'); return; }
    try {
      const auth = await loginUsuario(loginData);
      onLogin({
        id: auth.id,
        nombres: auth.nombre,
        apellidos: auth.apellido,
        correo: auth.correo,
        token: auth.token,
        rol: auth.rol,
      });
    } catch (err: any) {
      setError(err?.response?.data || 'No se pudo conectar al servidor.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { confirmar, ...usuario } = regData;
    if (!usuario.nombres || !usuario.correo || !usuario.contrasena) { setError('Completa todos los campos'); return; }
    if (usuario.contrasena !== confirmar) { setError('Las contraseñas no coinciden'); return; }
    try {
      await registrarUsuario(usuario);
      setTab('login');
      setError('');
      alert('¡Registro exitoso! Ahora inicia sesión.');
    } catch (err: any) {
      setError(err?.response?.data || 'No se pudo conectar al servidor.');
    }
  };

return (
  <div className="auth-screen">

    <header className="auth-header">
      <img src={logo} alt="Mi Peluquería Virtual" />
    </header>
     
      <div className="auth-body">
        <div className="auth-card">
          <div className="tab-row">
            <button
              className={`tab ${tab === 'login' ? 'tab-active-dark' : 'tab-inactive'}`}
              onClick={() => { setTab('login'); setError(''); }}
            >
              Iniciar Sesión
            </button>
            <button
              className={`tab ${tab === 'register' ? 'tab-active-pink' : 'tab-inactive'}`}
              onClick={() => { setTab('register'); setError(''); }}
            >
              Regístrate
            </button>
            <div style={{ textAlign:'center', marginTop:20, paddingTop:16, borderTop:'1px solid #f0e0e6' }}>
  <span onClick={onEstilistaPortal} style={{ fontSize:13, color:'#c4607a', cursor:'pointer', fontWeight:500 }}>
    Eres estilista? Ingresa aqui
  </span>
</div>
          </div>

          {error && <div className="error-msg">{error}</div>}

          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="field-group">
                <label>Correo Electronico</label>
                <input
                  type="email"
                  placeholder="@correo.com"
                  value={loginData.correo}
                  onChange={e => setLoginData({ ...loginData, correo: e.target.value })}
                />
              </div>
              <div className="field-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginData.contrasena}
                  onChange={e => setLoginData({ ...loginData, contrasena: e.target.value })}
                />
              </div>
              <button type="submit" className="btn-dark">Iniciar Sesión</button>
             <button type="button" className="btn-google">
               <img src={google} alt="Google" className="google-icon" />
                Continuar con Google
              </button>
              <div className="center-link">
                <span className="link-pink">Olvidaste tu contraseña?</span>
              </div>
            </form>
          )}

          {tab === 'register' && (
            <form onSubmit={handleRegister}>
              <div className="field-row">
                <div className="field-group">
                  <label>Nombres</label>
                  <input type="text" value={regData.nombres}
                    onChange={e => setRegData({ ...regData, nombres: e.target.value })} />
                </div>
                <div className="field-group">
                  <label>Apellidos</label>
                  <input type="text" value={regData.apellidos}
                    onChange={e => setRegData({ ...regData, apellidos: e.target.value })} />
                </div>
              </div>
              <div className="field-row">
                <div className="field-group">
                  <label>Cedula</label>
                  <input type="text" value={regData.cedula}
                    onChange={e => setRegData({ ...regData, cedula: e.target.value })} />
                </div>
                <div className="field-group">
                  <label>Correo</label>
                  <input type="email" value={regData.correo}
                    onChange={e => setRegData({ ...regData, correo: e.target.value })} />
                </div>
              </div>
              <div className="field-row">
                <div className="field-group">
                  <label>Contraseña</label>
                  <input type="password" placeholder="••••••••"
                    value={regData.contrasena}
                    onChange={e => setRegData({ ...regData, contrasena: e.target.value })} />
                </div>
                <div className="field-group">
                  <label>Confirmar</label>
                  <input type="password" placeholder="••••••••"
                    value={regData.confirmar}
                    onChange={e => setRegData({ ...regData, confirmar: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="btn-dark">Registrarse</button>
              <button type="button" className="btn-google">
               <img src={google} alt="Google" className="google-icon" />
                Continuar con Google
              </button>
              <div className="center-link">
                Ya tienes una cuenta?{' '}
                <span className="link-pink" onClick={() => setTab('login')}>
                  Inicia Sesion Aqui
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
