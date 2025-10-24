# HPMM - Sistema de Gestión Integral (SGI)

##  Descripción

Sistema integral de gestión para el Hospital Público Mario Mendoza (HPMM), desarrollado para optimizar y digitalizar los procesos administrativos, logísticos y de control de inventario del hospital.

##  Arquitectura del Proyecto

Este proyecto está dividido en dos módulos principales:

- **hpmm-iu**: Frontend (React + TypeScript + Vite)
- **hpmm-api**: Backend (Node.js + Express + PostgreSQL)

##  Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de UI
- **TypeScript 5** - Tipado estático
- **Vite 6** - Build tool y dev server
- **Tailwind CSS 3** - Framework de CSS
- **Axios** - Cliente HTTP
- **React Router DOM 6** - Enrutamiento
- **React Toastify** - Notificaciones
- **Recharts** - Gráficos y visualizaciones
- **Framer Motion** - Animaciones
- **jsPDF & html2canvas** - Generación de PDFs

### Backend
- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **PostgreSQL** - Base de datos
- **TypeScript** - Tipado estático
- **JWT** - Autenticación
- **Bcrypt** - Encriptación de contraseñas

### DevOps & Quality
- **ESLint** - Linter de código
- **Prettier** - Formateador de código
- **GitHub Actions** - CI/CD
- **Docker** (opcional) - Contenerización

##  Estructura del Proyecto

```
proyecto/
├── hpmm-iu/                    # Frontend
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   │   ├── atoms/         # Componentes básicos
│   │   │   ├── molecules/     # Componentes compuestos
│   │   │   ├── organisms/     # Componentes complejos
│   │   │   ├── pages/         # Páginas completas
│   │   │   └── templates/     # Plantillas de layout
│   │   ├── contexts/          # Context API
│   │   ├── hooks/             # Custom hooks
│   │   ├── interfaces/        # Tipos TypeScript
│   │   ├── services/          # Servicios API
│   │   ├── helpers/           # Funciones auxiliares
│   │   ├── routes/            # Configuración de rutas
│   │   └── layouts/           # Layouts principales
│   ├── public/                # Archivos estáticos
│   └── certs/                 # Certificados SSL
│
└── hpmm-api/                  # Backend
    ├── src/
    │   ├── controllers/       # Controladores
    │   ├── routes/            # Rutas API
    │   ├── models/            # Modelos de datos
    │   ├── middlewares/       # Middlewares
    │   └── config/            # Configuraciones
    └── dist/                  # Build de producción
```

##  Requisitos Previos

- **Node.js**: v20.x o superior
- **npm**: v10.x o superior
- **PostgreSQL**: v14.x o superior
- **Git**: Para control de versiones

##  Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/hpmmSGI.git
cd hpmmSGI
```

### 2. Configurar el Backend

```bash
cd hpmm-api
npm install
```

Crear archivo `.env`:

```env
PORT=3000
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/hpmm_db
JWT_SECRET=tu_secreto_jwt_aqui
NODE_ENV=development
```

### 3. Configurar el Frontend

```bash
cd ../hpmm-iu
npm install
```

Crear archivo `.env`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=HPMM SGI
```

## 🏃‍♂️ Ejecutar en Desarrollo

### Backend
```bash
cd hpmm-api
npm run dev
```

### Frontend
```bash
cd hpmm-iu
npm run dev
```

El frontend estará disponible en `https://localhost:5173` (con HTTPS por defecto)


##  Build para Producción

### Backend
```bash
cd hpmm-api
npm run build
npm start
```

### Frontend
```bash
cd hpmm-iu
npm run build
npm run preview
```

##  Módulos Principales del Sistema

### 1. Gestión de Usuarios y Roles
- Control de acceso basado en roles (RBAC)
- Autenticación JWT
- Gestión de permisos

### 2. Gestión de Requisiciones
- Creación y aprobación de requisiciones
- Flujo de trabajo con estados
- Historial de cambios

### 3. Gestión de Compras
- Órdenes de compra
- Gestión de proveedores
- Seguimiento de facturación

### 4. Kardex / Inventario
- Control de entradas y salidas
- Trazabilidad con RFID
- Gestión de lotes y vencimientos
- Cálculo de costos (PEPS)

### 5. Reportes y Análisis
- Dashboard con métricas clave
- Reportes en PDF
- Gráficos interactivos

### 6. Gestión de Pactos
- Registro de convenios
- Control de unidades ejecutoras
- Asignación de presupuesto

## Seguridad

- Autenticación JWT con refresh tokens
- Encriptación de contraseñas con bcrypt
- HTTPS en desarrollo y producción
- Validación de inputs en frontend y backend
- Protección CORS configurada
- Rate limiting en API

## Variables de Entorno

### Backend (.env)
```env
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/db
JWT_SECRET=secret_key
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d
NODE_ENV=production
CORS_ORIGIN=https://tudominio.com
```

### Frontend (.env)
```env
VITE_API_URL=https://api.tudominio.com
VITE_APP_NAME=HPMM SGI
VITE_ENABLE_ANALYTICS=true
```

## Despliegue
// PENDIENTE
### Frontend (Vercel/Netlify)
```bash
npm run build
# Configurar variables de entorno en el proveedor
# Desplegar carpeta dist/
```
// PENDIENTE
### Backend (Railway/Heroku/AWS)
```bash
npm run build
# Configurar variables de entorno
# Desplegar con PM2 o Docker
```

##  Licencia

Este proyecto es privado y confidencial. Todos los derechos reservados © 2025 Hospital Público Mario Mendoza.

##  Equipo de Desarrollo

- **Desarrollador Principal**: [José Quintero, Ronnie Bueso]
- **Product Owner**: [José Quintero, Ronnie Bueso]
- **QA**: [José Quintero, Ronnie Bueso]

##  Soporte

Para reportar bugs o solicitar nuevas funcionalidades, por favor crea un issue en el repositorio de GitHub.

---

**Última actualización**: Octubre 2025