const { Router } = require('express');
const AuthController = require('../controllers/auth.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

const router = Router();

router.post('/login', AuthController.login);
router.post(
  '/cambiar-password',
  verificarToken,
  AuthController.cambiarPassword
);
router.get('/verificar', verificarToken, AuthController.verificarToken);

module.exports = router;
