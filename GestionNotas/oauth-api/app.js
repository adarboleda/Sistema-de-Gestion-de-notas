const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./config/database.config');
const Usuario = require('./models/user.model');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Para soportar imágenes base64

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Sincronizar base de datos y arrancar servidor
sequelize
  .sync({ alter: false })
  .then(() => {
    console.log('✅ Base de datos sincronizada');

    app.listen(PORT, () => {
      console.log(
        `🚀 Servidor de autenticación corriendo en http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error('❌ Error al sincronizar la base de datos:', error);
  });

module.exports = app;
