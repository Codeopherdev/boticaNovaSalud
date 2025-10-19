const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const path = require('path');
require('dotenv').config();

// Importar middlewares
const auth = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');

// Importar controladores
const authController = require('./controllers/authController');
const productController = require('./controllers/productController');
const saleController = require('./controllers/saleController');
const alertController = require('./controllers/alertController');
const reportController = require('./controllers/reportController');
const userController = require('./controllers/userController');

// Importar servicios
const alertService = require('./services/alertService');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de la base de datos
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nova-salud')
.then(() => {
  console.log('✅ Conectado a MongoDB');
  // Inicializar datos de ejemplo
  require('./utils/seedData').initializeData();
})
.catch(err => {
  console.error('❌ Error conectando a MongoDB:', err);
  process.exit(1);
});

// Configuración del motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares globales
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Configuración de sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'nova-salud-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/nova-salud',
    touchAfter: 24 * 3600 // lazy session update
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Middleware para variables globales
app.use(async (req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.isAdmin = req.session.user && req.session.user.role === 'admin';
  res.locals.success = req.session.success;
  res.locals.error = req.session.error;
  
  // Limpiar mensajes flash después de mostrarlos
  delete req.session.success;
  delete req.session.error;
  
  // Obtener alertas para el usuario actual
  if (req.session.user) {
    try {
      const alerts = await alertService.getActiveAlerts();
      res.locals.alerts = alerts;
      res.locals.alertCount = alerts.length;
    } catch (error) {
      res.locals.alerts = [];
      res.locals.alertCount = 0;
    }
  }
  
  next();
});

// ===== RUTAS =====

// Ruta principal - redirigir al dashboard si está autenticado
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

// Rutas de autenticación
app.get('/login', authController.showLogin);
app.post('/login', authController.login);
app.get('/logout', authController.logout);

// Dashboard (requiere autenticación)
app.get('/dashboard', auth.requireAuth, async (req, res) => {
  try {
    const Product = require('./models/Product');
    const Sale = require('./models/Sale');
    const Alert = require('./models/Alert');
    
    // Obtener estadísticas para el dashboard
    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.countDocuments({ 
      $expr: { $lte: ['$stock', '$stockMinimo'] }
    });
    const totalSales = await Sale.countDocuments();
    const activeAlerts = await Alert.countDocuments({ isReviewed: false });
    
    // Ventas del día actual
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todaySales = await Sale.find({
      createdAt: { $gte: today, $lt: tomorrow }
    });
    
    const todayRevenue = todaySales.reduce((total, sale) => total + sale.total, 0);
    
    // Productos con stock bajo
    const lowStockItems = await Product.find({ 
      $expr: { $lte: ['$stock', '$stockMinimo'] }
    })
      .limit(5)
      .select('name stock stockMinimo');
    
    res.render('dashboard', {
      title: 'Dashboard',
      stats: {
        totalProducts,
        lowStockProducts,
        totalSales,
        activeAlerts,
        todayRevenue,
        todaySalesCount: todaySales.length
      },
      lowStockItems
    });
  } catch (error) {
    console.error('Error en dashboard:', error);
    req.session.error = 'Error al cargar el dashboard';
    res.redirect('/login');
  }
});

// Rutas de productos
app.get('/products', auth.requireAuth, productController.index);
app.get('/products/new', auth.requireAuth, productController.showNew);
app.post('/products', auth.requireAuth, productController.create);
app.get('/products/:id', auth.requireAuth, productController.show);
app.get('/products/:id/edit', auth.requireAuth, productController.showEdit);
app.put('/products/:id', auth.requireAuth, productController.update);
app.delete('/products/:id', auth.requireAuth, productController.delete);

// Rutas de ventas
app.get('/sales', auth.requireAuth, saleController.index);
app.get('/sales/new', auth.requireAuth, saleController.showNew);
app.post('/sales', auth.requireAuth, saleController.create);
app.get('/sales/:id', auth.requireAuth, saleController.show);
app.get('/sales/history', auth.requireAuth, saleController.history);

// API para carrito de compras
app.post('/api/cart/add', auth.requireAuth, saleController.addToCart);
app.post('/api/cart/remove', auth.requireAuth, saleController.removeFromCart);
app.post('/api/cart/update', auth.requireAuth, saleController.updateCart);
app.get('/api/cart', auth.requireAuth, saleController.getCart);
app.post('/api/cart/clear', auth.requireAuth, saleController.clearCart);

// Rutas de alertas
app.get('/alerts', auth.requireAuth, alertController.index);
app.get('/alerts/:id', auth.requireAuth, alertController.show);
app.put('/alerts/:id/resolve', auth.requireAuth, alertController.resolve);

// Rutas de reportes (solo admin)
app.get('/reports', auth.requireAuth, auth.requireAdmin, reportController.dashboard);
app.get('/reports/daily-sales', auth.requireAuth, auth.requireAdmin, reportController.dailySales);
app.get('/reports/products', auth.requireAuth, auth.requireAdmin, reportController.products);

// Rutas de usuarios (solo admin)
app.get('/users', auth.requireAuth, auth.requireAdmin, userController.index);
app.get('/users/new', auth.requireAuth, auth.requireAdmin, userController.showNew);
app.post('/users', auth.requireAuth, auth.requireAdmin, userController.create);
app.get('/users/:id', auth.requireAuth, auth.requireAdmin, userController.show);
app.put('/users/:id', auth.requireAuth, auth.requireAdmin, userController.update);
app.delete('/users/:id', auth.requireAuth, auth.requireAdmin, userController.delete);

// API para cambio de contraseña
app.post('/api/change-password', auth.requireAuth, authController.changePassword);

// Ruta para verificar stock en tiempo real
app.get('/api/products/:id/stock', auth.requireAuth, async (req, res) => {
  try {
    const Product = require('./models/Product');
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json({ 
      id: product._id,
      name: product.name,
      quantity: product.quantity,
      price: product.price
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al verificar stock' });
  }
});

// Middleware de manejo de errores
app.use(errorHandler);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).render('error', {
    title: 'Página no encontrada',
    error: {
      status: 404,
      message: 'La página que buscas no existe'
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Nova Salud ejecutándose en http://localhost:${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  
  // Ejecutar verificación de alertas cada 30 minutos
  setInterval(async () => {
    try {
      await alertService.checkAndCreateAlerts();
      console.log('✅ Verificación automática de alertas completada');
    } catch (error) {
      console.error('❌ Error en verificación automática de alertas:', error);
    }
  }, 30 * 60 * 1000); // 30 minutos
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Error no capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:', reason);
  process.exit(1);
});

module.exports = app;