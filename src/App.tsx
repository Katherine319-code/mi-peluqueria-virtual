import React, { useEffect, useState } from 'react';
import { Usuario, Servicio, Cita, Screen, Estilista } from './types';
import { cancelarCitaApi, guardarCita, listarCitasCliente, obtenerEstilistaPorUsuario } from './services/api';

import AuthScreen     from './components/Auth/AuthScreen';
import HomeScreen     from './components/Home/HomeScreen';
import ServicesScreen from './components/Services/ServicesScreen';
import BookingScreen  from './components/Booking/BookingScreen';
import PaymentScreen  from './components/Payment/PaymentScreen';
import CitasScreen    from './components/Citas/CitasScreen';
import CalendarioMes   from './components/EstilistaCalendar/CalendarioMes';
import AgendaDia       from './components/EstilistaCalendar/AgendaDia';
import AdminDashboard  from './components/Admin/AdminDashboard';
import ProfileScreen  from './components/Profile/ProfileScreen';

const App: React.FC = () => {
  const [screen, setScreen]             = useState<Screen>('auth');
  const [user, setUser]                 = useState<Usuario | null>(null);
  const [selectedService, setSelectedService] = useState<Servicio | null>(null);
  const [pendingCita, setPendingCita]   = useState<(Omit<Cita, 'id' | 'estado'> & { estilistaId: number }) | null>(null);
  const [citas, setCitas]               = useState<Cita[]>([]);
  const [justConfirmed, setJustConfirmed] = useState(false);

  const [estilista, setEstilista]             = useState<Estilista | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');

  const goTo = (s: Screen) => {
    if (s === 'auth') { setUser(null); setCitas([]); }
    setScreen(s);
  };

  useEffect(() => {
    if (!user?.id || user.rol === 'ADMIN') return;
    listarCitasCliente(user.id).then(setCitas).catch(() => setCitas([]));
  }, [user]);

  const handleLogin = async (u: Usuario) => {
    setUser(u);
    if (u.rol === 'ADMIN') {
      setScreen('admin');
    } else if (u.rol === 'ESTILISTA' && u.id) {
      try {
        const est = await obtenerEstilistaPorUsuario(u.id);
        setEstilista(est);
        setScreen('estilista-calendario');
      } catch {
        alert('No se pudo cargar tu perfil de estilista.');
        setScreen('auth');
      }
    } else {
      setScreen('home');
    }
  };

  const handleBookingConfirm = (cita: Omit<Cita, 'id' | 'estado'> & { estilistaId: number }) => {
    setPendingCita(cita); setScreen('payment');
  };

  const handlePagar = async (metodo: string) => {
    if (!pendingCita || !user?.id) return;
    try {
      const saved = await guardarCita({
        clienteId: user.id,
        estilistaId: pendingCita.estilistaId,
        fecha: pendingCita.fecha,
        hora: pendingCita.hora,
        metodoPago: metodo,
        servicioId: pendingCita.servicio.id,
        total: pendingCita.servicio.precio,
      });
      setCitas(prev => [saved, ...prev]);
      setJustConfirmed(true);
      setScreen('citas');
      setTimeout(() => setJustConfirmed(false), 5000);
    } catch (error: any) {
      alert('Error: ' + (error?.response?.data || error?.message));
    }
  };

  const handleCancelarCita = async (id: number) => {
    try { await cancelarCitaApi(id); } catch { }
    setCitas(prev => prev.filter(c => c.id !== id));
  };

  const handleDiaClick = (fecha: string) => {
    setFechaSeleccionada(fecha); setScreen('estilista-agenda-dia');
  };

  const handleEstilistaLogout = () => {
    setEstilista(null); setScreen('auth');
  };

  return (
    <>
      {screen === 'auth' && (
        <AuthScreen onLogin={handleLogin} />
      )}
      {screen === 'home'     && user && <HomeScreen user={user} onNavigate={goTo} />}
      {screen === 'services' && <ServicesScreen onNavigate={goTo} onSelectService={setSelectedService} />}
      {screen === 'booking'  && selectedService && <BookingScreen servicio={selectedService} onNavigate={goTo} onConfirm={handleBookingConfirm} />}
      {screen === 'payment'  && pendingCita && <PaymentScreen cita={pendingCita} onNavigate={goTo} onPagar={handlePagar} />}
      {screen === 'citas'    && <CitasScreen citas={citas} justConfirmed={justConfirmed} onNavigate={goTo} onCancelar={handleCancelarCita} />}
      {screen === 'admin'    && user?.rol === 'ADMIN' && <AdminDashboard user={user} onLogout={() => goTo('auth')} />}
      {screen === 'profile'  && user && <ProfileScreen user={user} onNavigate={goTo} onLogout={() => goTo('auth')} />}
      {screen === 'estilista-calendario' && estilista && <CalendarioMes estilista={estilista} onDiaClick={handleDiaClick} onLogout={handleEstilistaLogout} />}
      {screen === 'estilista-agenda-dia' && estilista && <AgendaDia estilista={estilista} fecha={fechaSeleccionada} onVolver={() => setScreen('estilista-calendario')} onLogout={handleEstilistaLogout} />}
    </>
  );
};

export default App;
