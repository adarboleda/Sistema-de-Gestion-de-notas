import { Actividad } from '../models/actividad.js';
import { Usuario } from '../models/usuario.js';

// Registrar una nueva actividad
export const registrarActividad = async (
  tipo,
  descripcion,
  usuario_id,
  entidad_tipo = null,
  entidad_id = null
) => {
  try {
    await Actividad.create({
      tipo,
      descripcion,
      usuario_id,
      entidad_tipo,
      entidad_id,
      fecha: new Date(),
    });
  } catch (error) {
    console.error('Error al registrar actividad:', error);
  }
};

// Listar últimas actividades
export const listarUltimasActividades = async (req, res) => {
  try {
    const { limite = 10 } = req.query;

    const actividades = await Actividad.findAll({
      include: [
        {
          model: Usuario,
          attributes: ['id', 'username', 'nombre_completo', 'rol'],
        },
      ],
      order: [['fecha', 'DESC']],
      limit: parseInt(limite),
    });

    res.json(actividades);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Error al listar las actividades',
      mensaje: error.message,
    });
  }
};

// Listar actividades por usuario
export const listarActividadesPorUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const { limite = 20 } = req.query;

    const actividades = await Actividad.findAll({
      where: { usuario_id },
      order: [['fecha', 'DESC']],
      limit: parseInt(limite),
    });

    res.json(actividades);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Error al listar las actividades del usuario',
      mensaje: error.message,
    });
  }
};
