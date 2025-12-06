import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbConnect, sequelize } from './src/config/database.js';

// Importar modelos en orden: primero las entidades base, luego las que tienen relaciones
import { Usuario } from './src/models/usuario.js';
import { Estudiante } from './src/models/estudiante.js';
import { Docente } from './src/models/docente.js';
import { Asignatura } from './src/models/asignatura.js';
import { Nota } from './src/models/nota.js';
import { Evaluacion } from './src/models/evaluacion.js';
import { RegistroAcademico } from './src/models/registroAcademico.js';
import { Actividad } from './src/models/actividad.js';
import { Notificacion } from './src/models/notificacion.js';
import { Evento } from './src/models/evento.js';

import estudianteRoutes from './src/routes/estudianteRoutes.js';
import docenteRoutes from './src/routes/docenteRoutes.js';
import asignaturaRoutes from './src/routes/asignaturaRoutes.js';
import notaRoutes from './src/routes/notasRoutes.js';
import evaluacionRoutes from './src/routes/evaluacionRoutes.js';
import registroAcademicoRoutes from './src/routes/registroAcademicoRoutes.js';
import actividadRoutes from './src/routes/actividadRoutes.js';
import notificacionRoutes from './src/routes/notificacionRoutes.js';
import eventoRoutes from './src/routes/eventoRoutes.js';

dotenv.config();
const app = express();

// Middleware (para manejar JSON y CORS)
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (_req, res) => res.send('Servidor de gestión de notas funcionando correctamente'));

// Registrar rutas
app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/docentes', docenteRoutes);
app.use('/api/asignaturas', asignaturaRoutes);
app.use('/api/notas', notaRoutes);
app.use('/api/evaluaciones', evaluacionRoutes);
app.use('/api/registro-academico', registroAcademicoRoutes);
app.use('/api/actividades', actividadRoutes);
app.use('/api/notificaciones', notificacionRoutes);
app.use('/api/eventos', eventoRoutes);

// Conexión a la BD y arranque del servidor
const iniciarServidor = async () => {
  try {
    await dbConnect();

    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados - Tablas recreadas con nuevas relaciones');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en el puerto ${PORT}`);
      console.log(`URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error.message);
    process.exit(1);
  }
};
iniciarServidor();
