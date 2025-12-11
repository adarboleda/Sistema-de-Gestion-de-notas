import { Estudiante } from '../models/estudiante.js';
import { Op } from 'sequelize';
import fetch from 'node-fetch';

// URL del servicio de autenticación
const AUTH_API_URL = 'http://localhost:3001/api';

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
      password, // Nueva contraseña
    } = req.body;

    // Validaciones básicas
    if (!cedula || !nombre || !apellido || !email || !carrera) {
      return res.status(400).json({
        error:
          'Faltan datos obligatorios (cedula, nombre, apellido, email, carrera)',
      });
    }

    // Verificar si ya existe un estudiante con esa cédula o email
    const existente = await Estudiante.findOne({
      where: {
        [Op.or]: [{ cedula }, { email }],
      },
    });

    if (existente) {
      return res
        .status(400)
        .json({ error: 'Ya existe un estudiante con esa cédula o email' });
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

    // Crear usuario en el sistema de autenticación
    try {
      const passwordFinal = password || cedula; // Por defecto, la cédula

      console.log('🔐 Intentando crear usuario en oauth-api...');
      console.log('   URL:', `${AUTH_API_URL}/users/crear-estudiante`);
      console.log('   Email:', nuevoEstudiante.email);
      console.log('   Password:', passwordFinal ? '***' : '(vacío)');

      const responseAuth = await fetch(
        `${AUTH_API_URL}/users/crear-estudiante`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: nuevoEstudiante.email,
            password: passwordFinal,
            nombre_completo: `${nuevoEstudiante.nombre} ${nuevoEstudiante.apellido}`,
            estudiante_id: nuevoEstudiante.id,
          }),
        }
      );

      const responseData = await responseAuth.json();

      if (!responseAuth.ok) {
        console.error('❌ Error al crear usuario en oauth-api:');
        console.error('   Status:', responseAuth.status);
        console.error('   Respuesta:', responseData);
      } else {
        console.log('✅ Usuario creado exitosamente en oauth-api');
        console.log(
          '   ID Usuario:',
          responseData.data?.id || responseData.usuario?.id
        );
      }
    } catch (authError) {
      console.error('❌ Error de conexión con oauth-api:', authError.message);
      console.error('   Verifica que oauth-api esté corriendo en puerto 3001');
      // No fallar la creación del estudiante si falla el auth
    }

    res.status(201).json(nuevoEstudiante);
  } catch (error) {
    console.error('Error al crear estudiante:', error);
    res
      .status(500)
      .json({ error: 'Error al crear el estudiante', detalles: error.message });
  }
};

// Listar todos los estudiantes (con filtros opcionales)
export const listarEstudiantes = async (req, res) => {
  try {
    const { estado, curso, paralelo, incluirEliminados } = req.query;
    const where = {};

    // Solo filtrar por eliminado: false si no se solicita explícitamente incluir eliminados
    if (incluirEliminados !== 'true') {
      where.eliminado = false;
    }

    if (estado) {
      where.estado = estado;
      // Si filtran por "inactivo", incluir también los eliminados lógicamente
      if (estado === 'inactivo') {
        delete where.eliminado;
        where[Op.or] = [
          { estado: 'inactivo', eliminado: false },
          { eliminado: true },
        ];
      }
    }
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
      return res
        .status(400)
        .json({ error: 'Debe proporcionar un término de búsqueda' });
    }

    const estudiantes = await Estudiante.findAll({
      where: {
        eliminado: false,
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
    const estudiante = await Estudiante.findOne({
      where: { id, eliminado: false },
    });
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
      password, // Nueva contraseña opcional
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
              [Op.or]: [
                cedula ? { cedula } : null,
                email ? { email } : null,
              ].filter(Boolean),
            },
          ],
        },
      });

      if (existente) {
        return res
          .status(400)
          .json({ error: 'Ya existe otro estudiante con esa cédula o email' });
      }
    }

    // Actualizar campos
    if (cedula) estudiante.cedula = cedula;
    if (nombre) estudiante.nombre = nombre;
    if (apellido) estudiante.apellido = apellido;
    if (email) estudiante.email = email;
    if (telefono !== undefined) estudiante.telefono = telefono;
    if (direccion !== undefined) estudiante.direccion = direccion;
    if (fecha_nacimiento !== undefined)
      estudiante.fecha_nacimiento = fecha_nacimiento;
    if (carrera !== undefined) estudiante.carrera = carrera;
    if (foto !== undefined) estudiante.foto = foto;
    if (curso !== undefined) estudiante.curso = curso;
    if (paralelo !== undefined) estudiante.paralelo = paralelo;

    // Manejar estado y restauración de estudiantes eliminados
    if (estado !== undefined) {
      estudiante.estado = estado;
      // Si se cambia a 'activo', restaurar el estudiante (quitar flag de eliminado)
      if (estado === 'activo') {
        estudiante.eliminado = false;
        console.log(
          `Restaurando estudiante ID ${id}: eliminado cambiado a false`
        );
      }
    }

    await estudiante.save();
    console.log(
      `Estudiante actualizado - ID: ${id}, Estado: ${estudiante.estado}, Eliminado: ${estudiante.eliminado}`
    );

    // Actualizar contraseña en oauth-api si se proporcionó
    if (password) {
      try {
        console.log('🔐 Actualizando contraseña en oauth-api...');
        console.log('   Email:', estudiante.email);

        const responseAuth = await fetch(
          `${AUTH_API_URL}/users/actualizar-password-estudiante`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              estudiante_id: estudiante.id,
              password: password,
            }),
          }
        );

        const responseData = await responseAuth.json();

        if (!responseAuth.ok) {
          console.error('❌ Error al actualizar contraseña en oauth-api:');
          console.error('   Status:', responseAuth.status);
          console.error('   Respuesta:', responseData);
        } else {
          console.log('✅ Contraseña actualizada exitosamente en oauth-api');
        }
      } catch (authError) {
        console.error('❌ Error de conexión con oauth-api:', authError.message);
        // No fallar la actualización del estudiante si falla el auth
      }
    }

    res.status(200).json(estudiante);
  } catch (error) {
    console.error('Error al actualizar estudiante:', error);
    res.status(500).json({
      error: 'Error al actualizar el estudiante',
      detalles: error.message,
    });
  }
};

// Eliminar un estudiante por ID (eliminación lógica - soft delete)
export const eliminarEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const estudiante = await Estudiante.findOne({
      where: { id, eliminado: false },
    });
    if (estudiante) {
      estudiante.eliminado = true;
      estudiante.estado = 'inactivo';
      await estudiante.save();
      res
        .status(200)
        .json({ message: 'Estudiante eliminado exitosamente', estudiante });
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
    res
      .status(500)
      .json({ error: 'Error al cambiar el estado del estudiante' });
  }
};
