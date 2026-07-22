import React, { useEffect, useRef, useState } from 'react';
import { Usuario, LoginRequest } from '../../types';
import { registrarUsuario, loginUsuario, loginConGoogle } from '../../services/api';
import { GOOGLE_CLIENT_ID } from '../../config';
import './AuthScreen.css';
import logo from '../../assets/img/logo.png';
import google from '../../assets/img/google.png';

interface Props {
  onLogin: (user: Usuario) => void;
}

declare global {
  interface Window {
    google?: any;
  }
}

const AuthScreen: React.FC<Props> = ({ onLogin }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [loginData, setLoginData] = useState<LoginRequest>({ correo: '', contrasena: '' });

  const [regData, setRegData] = useState<Omit<Usuario, 'id'> & { confirmar: string }>({
    nombres: '', apellidos: '', cedula: '', correo: '', contrasena: '', confirmar: '',
  });

  const googleBtnRef = useRef<HTMLDivElement>(null);
const onLoginRef = useRef(onLogin);
useEffect(() => {
  onLoginRef.current = onLogin;
}, [onLogin]);

  // ── Inicializa Google Identity Services una sola vez ──────────────────────
  useEffect(() => {
    const initGoogle = () => {
      if (!window.google || !googleBtnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response: { credential: string }) => {
          setError('');
          try {
            const auth = await loginConGoogle(response.credential);
            onLoginRef.current({
              id: auth.id,
              nombres: auth.nombre,
              apellidos: auth.apellido,
              correo: auth.correo,
              token: auth.token,
              rol: auth.rol,
            });
          } catch (err: any) {
            setError(err?.response?.data || 'No se pudo iniciar sesion con Google.');
          }
        },
      });
      // Renderiza el boton real de Google, oculto, para poder "disparlo"
      // desde nuestros botones personalizados con el mismo estilo del resto de la app.
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
      });
    };

    if (window.google) {
      initGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          initGoogle();
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, []);

  const handleGoogleClick = () => {
    // Busca el boton real (invisible) que Google renderizo y le hace clic
    const realBtn = googleBtnRef.current?.querySelector('div[role="button"]') as HTMLElement | null;
    realBtn?.click();
  };

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
    setSuccessMsg('');
    const { confirmar, ...usuario } = regData;
    if (!usuario.nombres || !usuario.correo || !usuario.contrasena) { setError('Completa todos los campos'); return; }
    if (usuario.contrasena !== confirmar) { setError('Las contraseñas no coinciden'); return; }
    try {
      await registrarUsuario(usuario);
      setTab('login');
      setError('');
      setLoginData({ correo: usuario.correo, contrasena: '' });
      setSuccessMsg('¡Registro exitoso! Ahora inicia sesión.');
    } catch (err: any) {
      setError(err?.response?.data || 'No se pudo conectar al servidor.');
    }
  };

return (
  <div className="auth-screen">

    <header className="auth-header">
      <img src={logo} alt="Mi Peluquería Virtual" />
    </header>

    {/* Boton real de Google, invisible: lo disparamos desde nuestros botones estilizados */}
    <div ref={googleBtnRef} style={{ position: 'absolute', top: -9999, left: -9999 }} />

      <div className="auth-body">
        <div className="auth-card">
          <div className="tab-row">
            <button
              className={`tab ${tab === 'login' ? 'tab-active-dark' : 'tab-inactive'}`}
              onClick={() => { setTab('login'); setError(''); setSuccessMsg(''); }}
            >
              Iniciar Sesión
            </button>
            <button
              className={`tab ${tab === 'register' ? 'tab-active-pink' : 'tab-inactive'}`}
              onClick={() => { setTab('register'); setError(''); setSuccessMsg(''); }}
            >
              Regístrate
            </button>
          </div>

          {error && <div className="error-msg">{error}</div>}
          {successMsg && <div className="success-msg">{successMsg}</div>}

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
             <button type="button" className="btn-google" onClick={handleGoogleClick}>
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
              <button type="button" className="btn-google" onClick={handleGoogleClick}>
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
