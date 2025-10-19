#!/usr/bin/env node

/**
 * Script de inicio para Nova Salud
 * Verifica dependencias y configuración antes de iniciar el servidor
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Iniciando Nova Salud - Sistema de Inventario');
console.log('================================================\n');

// Verificar Node.js version
const nodeVersion = process.version;
const requiredVersion = '16.0.0';
console.log(`📋 Verificando versión de Node.js: ${nodeVersion}`);

if (parseInt(nodeVersion.slice(1)) < parseInt(requiredVersion)) {
  console.error(`❌ Se requiere Node.js ${requiredVersion} o superior`);
  process.exit(1);
}
console.log('✅ Versión de Node.js compatible\n');

// Verificar si existe package.json
if (!fs.existsSync('package.json')) {
  console.error('❌ No se encontró package.json');
  process.exit(1);
}

// Verificar si existen node_modules
if (!fs.existsSync('node_modules')) {
  console.log('📦 Instalando dependencias...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencias instaladas\n');
  } catch (error) {
    console.error('❌ Error instalando dependencias:', error.message);
    process.exit(1);
  }
}

// Verificar archivo .env
if (!fs.existsSync('.env')) {
  console.log('⚙️  Creando archivo .env desde .env.example...');
  if (fs.existsSync('.env.example')) {
    fs.copyFileSync('.env.example', '.env');
    console.log('✅ Archivo .env creado');
    console.log('ℹ️  Revisa y ajusta las configuraciones en .env según tu entorno\n');
  } else {
    console.log('⚠️  No se encontró .env.example, usando configuración por defecto\n');
  }
}

// Verificar conexión a MongoDB
console.log('🔍 Verificando conexión a MongoDB...');
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nova-salud';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => {
  console.log('✅ Conexión a MongoDB exitosa');
  mongoose.connection.close();
  
  // Verificar si necesita inicializar datos
  checkAndInitializeData();
})
.catch((error) => {
  console.error('❌ Error conectando a MongoDB:', error.message);
  console.log('\n💡 Sugerencias:');
  console.log('   1. Asegúrate de que MongoDB esté ejecutándose');
  console.log('   2. Verifica la URL de conexión en .env');
  console.log('   3. Instala MongoDB si no lo tienes: https://www.mongodb.com/try/download/community');
  process.exit(1);
});

async function checkAndInitializeData() {
  try {
    // Reconectar para verificar datos
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      console.log('\n🌱 Inicializando datos por primera vez...');
      const { initializeData } = require('./utils/seedData');
      await initializeData();
    } else {
      console.log(`✅ Base de datos ya contiene ${userCount} usuarios\n`);
    }
    
    await mongoose.connection.close();
    
    // Iniciar servidor
    startServer();
    
  } catch (error) {
    console.error('❌ Error verificando datos:', error.message);
    process.exit(1);
  }
}

function startServer() {
  console.log('🎯 Iniciando servidor...\n');
  
  // Mostrar información importante
  console.log('📋 INFORMACIÓN DEL SISTEMA:');
  console.log(`   🌐 URL: http://localhost:${process.env.PORT || 3000}`);
  console.log(`   🗄️  Base de datos: ${MONGODB_URI}`);
  console.log(`   🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log('\n🔐 CREDENCIALES POR DEFECTO:');
  console.log('   👨‍💼 Admin: admin@novasalud.com / admin123');
  console.log('   👨‍💻 Vendedor: vendedor@novasalud.com / vendedor123');
  console.log('\n' + '='.repeat(50));
  
  // Iniciar la aplicación
  require('./app.js');
}

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('\n❌ Error no capturado:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n❌ Promesa rechazada no manejada:', reason);
  process.exit(1);
});