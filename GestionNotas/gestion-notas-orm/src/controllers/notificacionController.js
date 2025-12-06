import { Notificacion } from '../models/notificacion.js';

// Crear una nueva notificación
export const crearNotificacion = async (req, res) => {
  try {
    const { titulo, mensaje, tipo, destinatario_id } = req.body;

    if (!titulo || !mensaje) {
      return res.status(400).json({
        error: 'El título y mensaje son obligatorios',
      });
    }

    const notificacion = await Notificacion.create({
      titulo,
      mensaje,
      tipo: tipo || 'info',
      destinatario_id: destinatario_id || null,
      fecha: new Date(),
    });

    res.status(201).json(notificacion);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Error al crear la notificación',
      mensaje: error.message,
    });
  }
};

// Listar notificaciones recientes
export const listarNotificaciones = async (req, res) => {
  try {
    const { destinatario_id, limite = 10, solo_no_leidas = false } = req.query;

    let where = {};
    if (destinatario_id) {
      where.destinatario_id = destinatario_id;
    }
    if (solo_no_leidas === 'true') {
      where.leida = false;
    }

    const notificaciones = await Notificacion.findAll({
      where,
      order: [['fecha', 'DESC']],
      limit: parseInt(limite),
    });

    res.json(notificaciones);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Error al listar las notificaciones',
      mensaje: error.message,
    });
  }
};

// Marcar notificación como leída
export const marcarComoLeida = async (req, res) => {
  try {
    const { id } = req.params;

    const notificacion = await Notificacion.findByPk(id);
    if (!notificacion) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }

    notificacion.leida = true;
    await notificacion.save();

    res.json(notificacion);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Error al actualizar la notificación',
      mensaje: error.message,
    });
  }
};

// Eliminar notificación
export const eliminarNotificacion = async (req, res) => {
  try {
    const { id } = req.params;

    const notificacion = await Notificacion.findByPk(id);
    if (!notificacion) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }

    await notificacion.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Error al eliminar la notificación',
      mensaje: error.message,
    });
  }
};
