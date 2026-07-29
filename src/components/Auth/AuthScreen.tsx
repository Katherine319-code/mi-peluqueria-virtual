import React, { useEffect, useRef, useState } from 'react';
import { Usuario, LoginRequest } from '../../types';
import { registrarUsuario, loginUsuario, loginConGoogle, solicitarRecuperacion, restablecerPassword } from '../../services/api';
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

type Modo = 'login' | 'register' | 'olvide-solicitar' | 'olvide-confirmar';

const AuthScreen: React.FC<Props> = ({ onLogin }) => {
  const [modo, setModo] = useState<Modo>('login');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [loginData, setLoginData] = useState<LoginRequest>({ correo: '', contrasena: '' });

  const [regData, setRegData] = useState<Omit<Usuario, 'id'> & { confirmar: string }>({
    nombres: '', apellidos: '', cedula: '', correo: '', contrasena: '', confirmar: '',
  });

  const [correoRecuperar, setCorreoRecuperar] = useState('');
  const [codigoRecuperar, setCodigoRecuperar] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarNuevaPassword, setConfirmarNuevaPassword] = useState('');
  const [enviando, setEnviando] = useState(false);

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
    const realBtn = googleBtnRef.current?.querySelector('div[role="button"]') as HTMLElement | null;
    realBtn?.click();
  };

  const cambiarModo = (nuevoModo: Modo) => {
    setModo(nuevoModo);
    setError('');
    setSuccessMsg('');
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
      setModo('login');
      setError('');
      setLoginData({ correo: usuario.correo, contrasena: '' });
      setSuccessMsg('¡Registro exitoso! Ahora inicia sesión.');
    } catch (err: any) {
      setError(err?.response?.data || 'No se pudo conectar al servidor.');
    }
  };

  const handleSolicitarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!correoRecuperar) { setError('Ingresa tu correo'); return; }
    setEnviando(true);
    try {
      await solicitarRecuperacion(correoRecuperar);
      setSuccessMsg('Te enviamos un codigo de verificacion a tu correo.');
      setModo('olvide-confirmar');
    } catch (err: any) {
      setError(err?.response?.data || 'No se pudo enviar el codigo.');
    } finally {
      setEnviando(false);
    }
  };

  const handleRestablecer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!codigoRecuperar || !nuevaPassword) { setError('Completa todos los campos'); return; }
    if (nuevaPassword !== confirmarNuevaPassword) { setError('Las contraseñas no coinciden'); return; }
    setEnviando(true);
    try {
      await restablecerPassword(correoRecuperar, codigoRecuperar, nuevaPassword);
      setSuccessMsg('Contraseña actualizada. Ya puedes iniciar sesion.');
      setLoginData({ correo: correoRecuperar, contrasena: '' });
      setCodigoRecuperar('');
      setNuevaPassword('');
      setConfirmarNuevaPassword('');
      setModo('login');
    } catch (err: any) {
      setError(err?.response?.data || 'No se pudo actualizar la contraseña.');
    } finally {
      setEnviando(false);
    }
  };

return (
  <div className="auth-screen">

    <header className="auth-header">
      <img src={logo} alt="Mi Peluquería Virtual" />
    </header>

    <div ref={googleBtnRef} style={{ position: 'absolute', top: -9999, left: -9999 }} />

      <div className="auth-body">
        <div className="auth-card">
          {(modo === 'login' || modo === 'register') && (
            <div className="tab-row">
              <button
                className={`tab ${modo === 'login' ? 'tab-active-dark' : 'tab-inactive'}`}
                onClick={() => cambiarModo('login')}
              >
                Iniciar Sesión
              </button>
              <button
                className={`tab ${modo === 'register' ? 'tab-active-pink' : 'tab-inactive'}`}
                onClick={() => cambiarModo('register')}
              >
                Regístrate
              </button>
            </div>
          )}

          {error && <div className="error-msg">{error}</div>}
          {successMsg && <div className="success-msg">{successMsg}</div>}

          {modo === 'login' && (
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
                <span className="link-pink" onClick={() => cambiarModo('olvide-solicitar')}>
                  Olvidaste tu contraseña?
                </span>
              </div>
            </form>
          )}

          {modo === 'register' && (
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
                <span className="link-pink" onClick={() => cambiarModo('login')}>
                  Inicia Sesion Aqui
                </span>
              </div>
            </form>
          )}

          {modo === 'olvide-solicitar' && (
            <form onSubmit={handleSolicitarCodigo}>
              <h2 className="auth-subtitle">Recuperar contraseña</h2>
              <p className="auth-hint">Ingresa tu correo y te enviaremos un codigo de verificacion.</p>
              <div className="field-group">
                <label>Correo Electronico</label>
                <input
                  type="email"
                  placeholder="@correo.com"
                  value={correoRecuperar}
                  onChange={e => setCorreoRecuperar(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-dark" disabled={enviando}>
                {enviando ? 'Enviando...' : 'Enviar codigo'}
              </button>
              <div className="center-link">
                <span className="link-pink" onClick={() => cambiarModo('login')}>
                  ← Volver a iniciar sesion
                </span>
              </div>
            </form>
          )}

          {modo === 'olvide-confirmar' && (
            <form onSubmit={handleRestablecer}>
              <h2 className="auth-subtitle">Ingresa el codigo</h2>
              <p className="auth-hint">Revisa tu correo ({correoRecuperar}) y escribe el codigo de 6 digitos.</p>
              <div className="field-group">
                <label>Codigo de verificacion</label>
                <input
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={codigoRecuperar}
                  onChange={e => setCodigoRecuperar(e.target.value)}
                />
              </div>
              <div className="field-group">
                <label>Nueva contraseña</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={nuevaPassword}
                  onChange={e => setNuevaPassword(e.target.value)}
                />
              </div>
              <div className="field-group">
                <label>Confirmar contraseña</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmarNuevaPassword}
                  onChange={e => setConfirmarNuevaPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-dark" disabled={enviando}>
                {enviando ? 'Actualizando...' : 'Restablecer contraseña'}
              </button>
              <div className="center-link">
                <span className="link-pink" onClick={() => cambiarModo('olvide-solicitar')}>
                  ¿No te llego el codigo? Reenviar
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

