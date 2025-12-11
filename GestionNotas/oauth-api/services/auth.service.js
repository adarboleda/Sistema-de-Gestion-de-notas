const jwt = require('jsonwebtoken');
const Usuario = require('../models/user.model');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET || 'gestion_notas_secret_key';
const jwtExpiration = process.env.JWT_EXPIRES_IN || '24h';

class AuthService {
  static async login(email, password) {
    try {
      // 1. Buscar usuario por email
      const usuario = await Usuario.findOne({ where: { email, activo: true } });

      if (!usuario) {
        return null;
      }

      // 2. Verificar contraseña
      const passwordValido = await usuario.verificarPassword(password);
      if (!passwordValido) {
        return null;
      }

      // 3. Actualizar último acceso
      await usuario.update({ ultimo_acceso: new Date() });

      // 4. Crear token JWT
      const payload = {
        sub: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
        estudiante_id: usuario.estudiante_id,
        docente_id: usuario.docente_id,
      };

      const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiration });

      return {
        token,
        user: {
          id: usuario.id,
          email: usuario.email,
          nombre_completo: usuario.nombre_completo,
          rol: usuario.rol,
          estudiante_id: usuario.estudiante_id,
          docente_id: usuario.docente_id,
        },
      };
    } catch (error) {
      console.error('Error en login:', error);
      return null;
    }
  }

  static async cambiarPassword(usuarioId, passwordActual, passwordNueva) {
    try {
      const usuario = await Usuario.findByPk(usuarioId);

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña actual
      const passwordValido = await usuario.verificarPassword(passwordActual);
      if (!passwordValido) {
        throw new Error('Contraseña actual incorrecta');
      }

      // Actualizar contraseña (el hook beforeUpdate la encriptará)
      await usuario.update({ password: passwordNueva });

      return true;
    } catch (error) {
      throw error;
    }
  }

  static verificarToken(token) {
    try {
      return jwt.verify(token, jwtSecret);
    } catch (error) {
      return null;
    }
  }
}

module.exports = AuthService;
