require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 3000;

// Conectar a la base de datos
connectDB();

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor Nova Salud ejecutándose en puerto ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV}`);
});