const { Router } = require('express');
const UserController = require('../controllers/user.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

const router = Router();

// Ruta protegida
router.get('/profile', verificarToken, UserController.getProfile);

// Rutas para crear usuarios (sin autenticación para permitir registro desde gestion-notas-orm)
router.post('/crear-estudiante', UserController.crearEstudiante);
router.post('/crear-docente', UserController.crearDocente);
router.post('/crear-admin', UserController.crearAdmin);

// Rutas para actualizar contraseñas
router.put(
  '/actualizar-password-estudiante',
  UserController.actualizarPasswordEstudiante
);
router.put(
  '/actualizar-password-docente',
  UserController.actualizarPasswordDocente
);

module.exports = router;
