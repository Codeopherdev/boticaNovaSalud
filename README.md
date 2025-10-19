# Nova Salud - Sistema de Inventario y Ventas

![Nova Salud Logo](https://img.shields.io/badge/Nova%20Salud-Sistema%20de%20Inventario-667eea?style=for-the-badge)

Sistema profesional de gestión de inventario y ventas diseñado específicamente para farmacias y establecimientos de salud.

## 🌟 Características Principales

### 👥 Gestión de Usuarios
- **Roles diferenciados**: Administradores y Vendedores
- **Autenticación segura** con bcrypt
- **Sesiones persistentes** con MongoDB
- **Gestión de permisos** por rol

### 📦 Inventario Inteligente
- **CRUD completo** de productos farmacéuticos
- **Control de stock** en tiempo real
- **Alertas automáticas** por stock bajo
- **Gestión de fechas de vencimiento**
- **Categorización** de productos

### 💰 Sistema de Ventas
- **Carrito de compras** intuitivo
- **Validación de stock** en tiempo real
- **Registro automático** de transacciones
- **Actualización automática** del inventario
- **Historial completo** de ventas

### 🚨 Sistema de Alertas
- **Alertas automáticas** por stock mínimo
- **Notificaciones** de productos próximos a vencer
- **Dashboard centralizado** de alertas
- **Gestión de estados** (activa/resuelta)

### 📊 Reportes y Analytics
- **Dashboard ejecutivo** con métricas clave
- **Reportes de ventas** diarias y personalizadas
- **Estadísticas de productos** más vendidos
- **Análisis de tendencias** (solo administradores)

### 📱 Interfaz Responsive
- **Diseño moderno** y profesional
- **Totalmente responsive** (móvil, tablet, desktop)
- **PWA ready** - instalable como app nativa
- **Navegación intuitiva** con menú adaptativo
- **Sistema de notificaciones** toast moderno

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **bcryptjs** - Encriptación de contraseñas
- **express-session** - Manejo de sesiones

### Frontend
- **EJS** - Motor de plantillas
- **CSS3** - Estilos modernos con variables CSS
- **JavaScript ES6+** - Funcionalidades interactivas
- **Font Awesome** - Iconografía
- **Service Worker** - Funcionalidades PWA

### Herramientas de Desarrollo
- **nodemon** - Desarrollo con hot reload
- **ESLint** - Linting de código
- **Jest** - Testing framework
- **dotenv** - Gestión de variables de entorno

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js** 16.0.0 o superior
- **MongoDB** 4.4 o superior
- **npm** 8.0.0 o superior

### Instalación Rápida

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/nova-salud/inventory-system.git
   cd nova-salud-inventory
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

4. **Iniciar MongoDB**
   ```bash
   # En Windows
   net start MongoDB
   
   # En macOS/Linux
   sudo systemctl start mongod
   ```

5. **Inicializar datos y ejecutar**
   ```bash
   npm run start
   ```

### Instalación Manual

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Configurar base de datos**
   ```bash
   # Crear archivo .env
   echo "MONGODB_URI=mongodb://localhost:27017/nova-salud" > .env
   echo "PORT=3000" >> .env
   echo "SESSION_SECRET=tu-clave-secreta-aqui" >> .env
   ```

3. **Inicializar datos de ejemplo**
   ```bash
   npm run seed
   ```

4. **Iniciar servidor**
   ```bash
   npm start
   ```

## 🔧 Scripts Disponibles

```bash
# Desarrollo con hot reload
npm run dev

# Producción
npm start

# Inicializar datos de ejemplo
npm run seed

# Resetear base de datos
npm run reset

# Ejecutar tests
npm test

# Tests en modo watch
npm test:watch

# Coverage de tests
npm test:coverage

# Linting
npm run lint

# Fix automático de linting
npm run lint:fix
```

## 🔐 Credenciales por Defecto

### Administrador
- **Email**: admin@novasalud.com
- **Contraseña**: admin123

### Vendedor
- **Email**: vendedor@novasalud.com
- **Contraseña**: vendedor123

> ⚠️ **Importante**: Cambia estas credenciales en producción

## 📁 Estructura del Proyecto

```
nova-salud-inventory/
├── 📁 controllers/          # Controladores de rutas
│   ├── authController.js
│   ├── productController.js
│   ├── saleController.js
│   ├── alertController.js
│   ├── reportController.js
│   └── userController.js
├── 📁 middleware/           # Middlewares personalizados
│   ├── auth.js
│   ├── validation.js
│   └── errorHandler.js
├── 📁 models/              # Modelos de Mongoose
│   ├── User.js
│   ├── Product.js
│   ├── Sale.js
│   └── Alert.js
├── 📁 public/              # Archivos estáticos
│   ├── 📁 css/
│   ├── 📁 js/
│   ├── 📁 icons/
│   ├── manifest.json
│   └── sw.js
├── 📁 services/            # Lógica de negocio
│   ├── inventoryService.js
│   ├── salesService.js
│   ├── alertService.js
│   └── reportService.js
├── 📁 utils/               # Utilidades
│   └── seedData.js
├── 📁 views/               # Plantillas EJS
│   ├── 📁 auth/
│   ├── 📁 products/
│   ├── 📁 sales/
│   ├── 📁 alerts/
│   ├── 📁 reports/
│   ├── 📁 users/
│   ├── layout.ejs
│   ├── dashboard.ejs
│   └── error.ejs
├── app.js                  # Aplicación principal
├── start.js               # Script de inicio
├── package.json
├── .env.example
└── README.md
```

## 🔄 Flujo de Trabajo

### Para Vendedores
1. **Login** con credenciales
2. **Consultar inventario** disponible
3. **Crear nueva venta** agregando productos al carrito
4. **Validar stock** automáticamente
5. **Procesar venta** y actualizar inventario
6. **Ver historial** de ventas realizadas

### Para Administradores
1. **Gestión completa** de productos
2. **Administración** de usuarios
3. **Visualización** de reportes y analytics
4. **Monitoreo** de alertas del sistema
5. **Configuración** del sistema

## 🚨 Sistema de Alertas

### Tipos de Alertas
- **Stock Bajo**: Cuando un producto alcanza el stock mínimo
- **Próximo a Vencer**: Productos que vencen en 30 días
- **Vencido**: Productos que ya han vencido

### Verificación Automática
- Las alertas se verifican **cada 30 minutos**
- Se generan automáticamente según los criterios
- Los usuarios pueden marcarlas como **resueltas**

## 📊 Métricas del Dashboard

- **Total de Productos** en inventario
- **Productos con Stock Bajo**
- **Total de Ventas** realizadas
- **Alertas Activas** pendientes
- **Ingresos del Día** actual
- **Ventas del Día** (cantidad)

## 🔒 Seguridad

### Medidas Implementadas
- **Encriptación** de contraseñas con bcrypt
- **Validación** de entrada en frontend y backend
- **Protección** de rutas por autenticación
- **Control de acceso** basado en roles
- **Sesiones seguras** con MongoDB
- **Sanitización** de datos de entrada

### Variables de Entorno Sensibles
```env
SESSION_SECRET=clave-super-secreta-cambiar-en-produccion
MONGODB_URI=mongodb://usuario:password@host:puerto/database
```

## 🧪 Testing

### Ejecutar Tests
```bash
# Tests unitarios
npm test

# Tests con coverage
npm test:coverage

# Tests en modo watch
npm test:watch
```

### Estructura de Tests
```
tests/
├── unit/
│   ├── models/
│   ├── services/
│   └── utils/
├── integration/
│   └── controllers/
└── e2e/
    └── workflows/
```

## 🚀 Despliegue

### Variables de Entorno para Producción
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/nova-salud
SESSION_SECRET=clave-super-secreta-aleatoria
PORT=3000
```

### Comandos de Despliegue
```bash
# Instalar dependencias de producción
npm ci --only=production

# Iniciar en producción
NODE_ENV=production npm start
```

## 🤝 Contribución

1. **Fork** el proyecto
2. **Crear** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abrir** un Pull Request

## 📝 Changelog

### v1.0.0 (2024-01-XX)
- ✨ Implementación inicial del sistema
- 👥 Sistema de autenticación y roles
- 📦 Gestión completa de inventario
- 💰 Sistema de ventas con carrito
- 🚨 Sistema de alertas automáticas
- 📊 Dashboard y reportes
- 📱 Interfaz responsive y PWA

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Nova Salud Team**
- Email: desarrollo@novasalud.com
- Website: https://novasalud.com

## 🙏 Agradecimientos

- **MongoDB** por la excelente base de datos
- **Express.js** por el framework robusto
- **Font Awesome** por los iconos
- **La comunidad de Node.js** por las herramientas

---

<div align="center">
  <strong>🏥 Nova Salud - Cuidando tu inventario, cuidando la salud 🏥</strong>
</div>