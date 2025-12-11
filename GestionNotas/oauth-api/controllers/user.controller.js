const Usuario = require('../models/user.model');

class UserController {
  static async getProfile(req, res) {
    try {
      const userId = req.user.sub;
      const usuario = await Usuario.findByPk(userId);

      if (!usuario) {
        return res.status(404).json({
          ok: false,
          message: 'Usuario no encontrado',
        });
      }

      res.json({
        ok: true,
        data: usuario,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: 'Error al obtener perfil',
      });
    }
  }

  // Crear usuario para estudiante
  static async crearEstudiante(req, res) {
    try {
      const { email, password, nombre_completo, estudiante_id } = req.body;

      const existente = await Usuario.findOne({ where: { email } });
      if (existente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un usuario con ese email',
        });
      }

      const usuario = await Usuario.create({
        email,
        password,
        nombre_completo,
        rol: 'estudiante',
        estudiante_id,
      });

      res.status(201).json({
        ok: true,
        usuario: usuario.toJSON(),
      });
    } catch (error) {
      console.error('Error al crear usuario estudiante:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear usuario',
      });
    }
  }

  // Crear usuario para docente
  static async crearDocente(req, res) {
    try {
      const { email, password, nombre_completo, docente_id } = req.body;

      console.log('🔍 DEBUG crearDocente:');
      console.log('   Email:', email);
      console.log('   Password recibido:', password);
      console.log('   Password type:', typeof password);
      console.log('   Password length:', password?.length);
      console.log('   Nombre completo:', nombre_completo);
      console.log('   Docente ID:', docente_id);

      const existente = await Usuario.findOne({ where: { email } });
      if (existente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un usuario con ese email',
        });
      }

      const usuario = await Usuario.create({
        email,
        password,
        nombre_completo,
        rol: 'docente',
        docente_id,
      });

      console.log('✅ Usuario docente creado con ID:', usuario.id);

      res.status(201).json({
        ok: true,
        usuario: usuario.toJSON(),
      });
    } catch (error) {
      console.error('Error al crear usuario docente:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear usuario',
      });
    }
  }

  // Crear usuario administrador
  static async crearAdmin(req, res) {
    try {
      const { email, password, nombre_completo } = req.body;

      const existente = await Usuario.findOne({ where: { email } });
      if (existente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un usuario con ese email',
        });
      }

      const usuario = await Usuario.create({
        email,
        password,
        nombre_completo,
        rol: 'admin',
      });

      res.status(201).json({
        ok: true,
        usuario: usuario.toJSON(),
      });
    } catch (error) {
      console.error('Error al crear usuario admin:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear usuario',
      });
    }
  }

  // Actualizar contraseña de estudiante
  static async actualizarPasswordEstudiante(req, res) {
    try {
      const { estudiante_id, password } = req.body;

      if (!estudiante_id || !password) {
        return res.status(400).json({
          success: false,
          message: 'estudiante_id y password son requeridos',
        });
      }

      const usuario = await Usuario.findOne({ where: { estudiante_id } });

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado para este estudiante',
        });
      }

      // Actualizar contraseña (el hook beforeUpdate la encriptará)
      usuario.password = password;
      await usuario.save();

      console.log(
        `✅ Contraseña actualizada para estudiante_id: ${estudiante_id}`
      );

      res.json({
        ok: true,
        message: 'Contraseña actualizada correctamente',
      });
    } catch (error) {
      console.error('Error al actualizar contraseña de estudiante:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar contraseña',
      });
    }
  }

  // Actualizar contraseña de docente
  static async actualizarPasswordDocente(req, res) {
    try {
      const { docente_id, password } = req.body;

      if (!docente_id || !password) {
        return res.status(400).json({
          success: false,
          message: 'docente_id y password son requeridos',
        });
      }

      const usuario = await Usuario.findOne({ where: { docente_id } });

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado para este docente',
        });
      }

      // Actualizar contraseña (el hook beforeUpdate la encriptará)
      usuario.password = password;
      await usuario.save();

      console.log(`✅ Contraseña actualizada para docente_id: ${docente_id}`);

      res.json({
        ok: true,
        message: 'Contraseña actualizada correctamente',
      });
    } catch (error) {
      console.error('Error al actualizar contraseña de docente:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar contraseña',
      });
    }
  }
}

module.exports = UserController;
