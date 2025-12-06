import { Estudiante } from '../models/estudiante.js';
import { Op } from 'sequelize';

// Crear un nuevo estudiante
export const crearEstudiante = async (req, res) => {
  try {
    const {
      cedula,
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      fecha_nacimiento,
      carrera,
      foto,
      curso,
      paralelo,
      estado,
      fecha_matricula,
    } = req.body;

    // Validaciones básicas
    if (!cedula || !nombre || !apellido || !email) {
      return res
        .status(400)
        .json({ error: 'Faltan datos obligatorios (cedula, nombre, apellido, email)' });
    }

    // Verificar si ya existe un estudiante con esa cédula o email
    const existente = await Estudiante.findOne({
      where: {
        [Op.or]: [{ cedula }, { email }],
      },
    });

    if (existente) {
      return res.status(400).json({ error: 'Ya existe un estudiante con esa cédula o email' });
    }

    const nuevoEstudiante = await Estudiante.create({
      cedula,
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      fecha_nacimiento,
      carrera,
      foto,
      curso,
      paralelo,
      estado: estado || 'activo',
      fecha_matricula: fecha_matricula || new Date(),
    });

    res.status(201).json(nuevoEstudiante);
  } catch (error) {
    console.error('Error al crear estudiante:', error);
    res.status(500).json({ error: 'Error al crear el estudiante', detalles: error.message });
  }
};

// Listar todos los estudiantes (con filtros opcionales)
export const listarEstudiantes = async (req, res) => {
  try {
    const { estado, curso, paralelo } = req.query;
    const where = {};

    if (estado) where.estado = estado;
    if (curso) where.curso = curso;
    if (paralelo) where.paralelo = paralelo;

    const estudiantes = await Estudiante.findAll({ where });
    res.status(200).json(estudiantes);
  } catch (error) {
    console.error('Error al listar estudiantes:', error);
    res.status(500).json({ error: 'Error al listar los estudiantes' });
  }
};

// Buscar estudiante por cédula, nombre, apellido o ID
export const buscarEstudiante = async (req, res) => {
  try {
    const { termino } = req.query;

    if (!termino) {
      return res.status(400).json({ error: 'Debe proporcionar un término de búsqueda' });
    }

    const estudiantes = await Estudiante.findAll({
      where: {
        [Op.or]: [
          { cedula: { [Op.like]: `%${termino}%` } },
          { nombre: { [Op.like]: `%${termino}%` } },
          { apellido: { [Op.like]: `%${termino}%` } },
          { id: isNaN(termino) ? null : parseInt(termino) },
        ],
      },
    });

    res.status(200).json(estudiantes);
  } catch (error) {
    console.error('Error al buscar estudiante:', error);
    res.status(500).json({ error: 'Error al buscar el estudiante' });
  }
};

// Obtener un estudiante por ID
export const obtenerEstudiantePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const estudiante = await Estudiante.findByPk(id);
    if (estudiante) {
      res.status(200).json(estudiante);
    } else {
      res.status(404).json({ error: 'Estudiante no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener estudiante:', error);
    res.status(500).json({ error: 'Error al obtener el estudiante' });
  }
};

// Actualizar un estudiante por ID
export const actualizarEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      cedula,
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      fecha_nacimiento,
      carrera,
      foto,
      curso,
      paralelo,
      estado,
    } = req.body;

    const estudiante = await Estudiante.findByPk(id);

    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    // Verificar si se está cambiando cédula o email a uno ya existente
    if (cedula || email) {
      const existente = await Estudiante.findOne({
        where: {
          [Op.and]: [
            { id: { [Op.ne]: id } },
            {
              [Op.or]: [cedula ? { cedula } : null, email ? { email } : null].filter(Boolean),
            },
          ],
        },
      });

      if (existente) {
        return res.status(400).json({ error: 'Ya existe otro estudiante con esa cédula o email' });
      }
    }

    // Actualizar campos
    if (cedula) estudiante.cedula = cedula;
    if (nombre) estudiante.nombre = nombre;
    if (apellido) estudiante.apellido = apellido;
    if (email) estudiante.email = email;
    if (telefono !== undefined) estudiante.telefono = telefono;
    if (direccion !== undefined) estudiante.direccion = direccion;
    if (fecha_nacimiento !== undefined) estudiante.fecha_nacimiento = fecha_nacimiento;
    if (carrera !== undefined) estudiante.carrera = carrera;
    if (foto !== undefined) estudiante.foto = foto;
    if (curso !== undefined) estudiante.curso = curso;
    if (paralelo !== undefined) estudiante.paralelo = paralelo;
    if (estado !== undefined) estudiante.estado = estado;

    await estudiante.save();
    res.status(200).json(estudiante);
  } catch (error) {
    console.error('Error al actualizar estudiante:', error);
    res.status(500).json({ error: 'Error al actualizar el estudiante', detalles: error.message });
  }
};

// Eliminar un estudiante por ID (eliminación física)
export const eliminarEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const estudiante = await Estudiante.findByPk(id);
    if (estudiante) {
      await estudiante.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Estudiante no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar estudiante:', error);
    res.status(500).json({ error: 'Error al eliminar el estudiante' });
  }
};

// Cambiar estado del estudiante (eliminación lógica o cambio de estado)
export const cambiarEstadoEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!['activo', 'inactivo', 'graduado', 'retirado'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const estudiante = await Estudiante.findByPk(id);

    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    estudiante.estado = estado;
    await estudiante.save();

    res.status(200).json(estudiante);
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ error: 'Error al cambiar el estado del estudiante' });
  }
};
