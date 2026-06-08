# Mi Peluquería Virtual — Frontend

Aplicación web desarrollada en React con TypeScript para la gestión de citas de una peluquería virtual. Permite a los clientes registrarse, iniciar sesión, reservar citas y realizar pagos. Los estilistas pueden ver su agenda diaria y mensual, y el administrador gestiona el sistema completo.

---

## Tecnologías utilizadas

- React 18 con TypeScript
- Vite como bundler
- Axios para las peticiones HTTP al backend
- CSS modular por componente

---

## Funcionalidades

- Registro e inicio de sesión de clientes
- Inicio de sesión para estilistas con credenciales asignadas por el administrador
- Inicio de sesión para el administrador
- Selección de servicios y reserva de citas
- Pago de citas por efectivo o PSE
- Vista de citas del cliente con opción de cancelar
- Agenda diaria y calendario mensual para estilistas
- Panel de administración para gestionar estilistas y servicios

---

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- El backend debe estar corriendo en `http://localhost:8080`

---

## Instalación y ejecución

1. Clona el repositorio e ingresa a la carpeta del frontend:

```bash
git clone <url-del-repositorio>
cd mi_peluqueria_virtual_fr
```

2. Instala las dependencias:

```bash
npm install
```

3. Inicia el servidor de desarrollo:

```bash
npm run dev
```

4. Abre el navegador en `http://localhost:5173`

---

## Estructura del proyecto

```
src/
├── assets/          # Imágenes y recursos estáticos
├── components/      # Componentes por módulo
│   ├── Admin/       # Panel de administración
│   ├── Auth/        # Login y registro de clientes
│   ├── Booking/     # Reserva de citas
│   ├── Citas/       # Vista de citas del cliente
│   ├── EstilistaAuth/     # Login de estilistas
│   ├── EstilistaCalendar/ # Agenda y calendario del estilista
│   ├── Home/        # Pantalla principal
│   ├── Payment/     # Pantalla de pago
│   └── Services/    # Listado de servicios
├── services/        # Llamadas a la API del backend
│   ├── api.ts
│   └── estilistaApi.ts
├── types/           # Tipos TypeScript compartidos
├── App.tsx          # Componente raíz y navegación por pantallas
└── main.tsx         # Punto de entrada
```

---

## Credenciales de prueba

| Rol | Correo | Contraseña |

| Administrador | admin@peluqueria.com | Admin123* |
| Estilista | hannah@peluqueria.com | Hannah123* |
| Estilista | sofia@peluqueria.com | Sofia123* |
| Estilista | laura@peluqueria.com | Laura123* |
| Estilista | valeria@peluqueria.com | Valeria123* |

Los clientes se registran directamente desde la pantalla de inicio.

---

## Conexión con el backend

Todas las peticiones apuntan a `http://localhost:8080`. Si el backend corre en otro puerto, actualiza la `baseURL` en `src/services/api.ts` y `src/services/estilistaApi.ts`.

