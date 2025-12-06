import { Evento } from '../models/evento.js';
import { Op } from 'sequelize';

// Crear un nuevo evento
export const crearEvento = async (req, res) => {
  try {
    const { titulo, descripcion, tipo, fecha_inicio, fecha_fin, asignatura_id, curso, color } =
      req.body;

    if (!titulo || !fecha_inicio) {
      return res.status(400).json({
        error: 'El título y fecha de inicio son obligatorios',
      });
    }

    const evento = await Evento.create({
      titulo,
      descripcion,
      tipo: tipo || 'otro',
      fecha_inicio,
      fecha_fin,
      asignatura_id,
      curso,
      color: color || 'primary',
    });

    res.status(201).json(evento);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Error al crear el evento',
      mensaje: error.message,
    });
  }
};

// Listar eventos (con filtros de fecha)
export const listarEventos = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, tipo, curso } = req.query;

    let where = {};
    if (tipo) where.tipo = tipo;
    if (curso) where.curso = curso;

    const eventos = await Evento.findAll({
      where,
      order: [['fecha_inicio', 'ASC']],
    });

    res.json(eventos);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Error al listar los eventos',
      mensaje: error.message,
    });
  }
};

// Obtener eventos próximos
export const obtenerEventosProximos = async (req, res) => {
  try {
    const { dias = 7 } = req.query;
    const hoy = new Date();
    const fechaFutura = new Date();
    fechaFutura.setDate(hoy.getDate() + parseInt(dias));

    const eventos = await Evento.findAll({
      where: {
        fecha_inicio: {
          [Op.between]: [hoy, fechaFutura],
        },
      },
      order: [['fecha_inicio', 'ASC']],
    });

    res.json(eventos || []);
  } catch (error) {
    console.error('Error al obtener eventos próximos:', error);
    // Devolver array vacío en vez de error para no romper el dashboard
    res.json([]);
  }
};

// Actualizar evento
export const actualizarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await Evento.findByPk(id);

    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    await evento.update(req.body);
    res.json(evento);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Error al actualizar el evento',
      mensaje: error.message,
    });
  }
};

// Eliminar evento
export const eliminarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await Evento.findByPk(id);

    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    await evento.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Error al eliminar el evento',
      mensaje: error.message,
    });
  }
};
