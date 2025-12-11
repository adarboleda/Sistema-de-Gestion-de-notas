const AuthService = require('../services/auth.service.js');

class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos',
        });
      }

      const result = await AuthService.login(email, password);

      if (!result) {
        return res.status(401).json({
          success: false,
          message: 'Email o contraseña incorrecta',
        });
      }

      res.json({
        ok: true,
        token: result.token,
        user: result.user,
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error en el servidor',
      });
    }
  }

  static async cambiarPassword(req, res) {
    try {
      const { passwordActual, passwordNueva } = req.body;
      const usuarioId = req.user.sub; // Del token JWT

      if (!passwordActual || !passwordNueva) {
        return res.status(400).json({
          success: false,
          message: 'Se requieren contraseña actual y nueva',
        });
      }

      if (passwordNueva.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña debe tener al menos 6 caracteres',
        });
      }

      await AuthService.cambiarPassword(
        usuarioId,
        passwordActual,
        passwordNueva
      );

      res.json({
        ok: true,
        message: 'Contraseña actualizada exitosamente',
      });
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async verificarToken(req, res) {
    res.json({
      ok: true,
      user: req.user,
    });
  }
}

module.exports = AuthController;
