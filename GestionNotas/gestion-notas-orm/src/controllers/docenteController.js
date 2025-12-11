import { Docente } from '../models/docente.js';
import { Asignatura } from '../models/asignatura.js';
import { Op } from 'sequelize';
import fetch from 'node-fetch';

// URL del servicio de autenticación
const AUTH_API_URL = 'http://localhost:3001/api';

// Crear un nuevo docente
export const crearDocente = async (req, res) => {
  try {
    const {
      cedula,
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      titulo_academico,
      especialidad,
      area,
      carga_horaria,
      estado,
      fecha_contratacion,
      password, // Nueva contraseña
    } = req.body;

    if (!cedula || !nombre || !apellido || !email) {
      return res.status(400).json({
        error:
          'Faltan datos obligatorios: cédula, nombre, apellido y email son requeridos',
      });
    }

    // Verificar si ya existe un docente con esa cédula o email
    const existente = await Docente.findOne({
      where: {
        [Op.or]: [{ cedula }, { email }],
      },
    });

    if (existente) {
      return res
        .status(400)
        .json({ error: 'Ya existe un docente con esa cédula o email' });
    }

    const nuevoDocente = await Docente.create({
      cedula,
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      titulo_academico,
      especialidad,
      area,
      carga_horaria: carga_horaria || 0,
      estado: estado || 'activo',
      fecha_contratacion: fecha_contratacion || new Date(),
    });

    // Crear usuario en el sistema de autenticación
    try {
      const passwordFinal = password || cedula; // Por defecto, la cédula

      console.log('🔐 Intentando crear usuario docente en oauth-api...');
      console.log('   URL:', `${AUTH_API_URL}/users/crear-docente`);
      console.log('   Email:', nuevoDocente.email);
      console.log('   Password:', passwordFinal ? '***' : '(vacío)');

      const responseAuth = await fetch(`${AUTH_API_URL}/users/crear-docente`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: nuevoDocente.email,
          password: passwordFinal,
          nombre_completo: `${nuevoDocente.nombre} ${nuevoDocente.apellido}`,
          docente_id: nuevoDocente.id,
        }),
      });

      const responseData = await responseAuth.json();

      if (!responseAuth.ok) {
        console.error('❌ Error al crear usuario docente en oauth-api:');
        console.error('   Status:', responseAuth.status);
        console.error('   Respuesta:', responseData);
      } else {
        console.log('✅ Usuario docente creado exitosamente en oauth-api');
        console.log(
          '   ID Usuario:',
          responseData.data?.id || responseData.usuario?.id
        );
      }
    } catch (authError) {
      console.error('❌ Error de conexión con oauth-api:', authError.message);
      console.error('   Verifica que oauth-api esté corriendo en puerto 3001');
      // No fallar la creación del docente si falla el auth
    }

    res.status(201).json(nuevoDocente);
  } catch (error) {
    console.error('Error al crear docente:', error);
    res
      .status(500)
      .json({ error: 'Error al crear el docente', mensaje: error.message });
  }
};

// Listar todos los docentes
export const listarDocentes = async (req, res) => {
  try {
    const { estado, area } = req.query;
    const where = { eliminado: false };

    if (estado) where.estado = estado;
    if (area) where.area = area;

    const docentes = await Docente.findAll({
      where,
      include: [
        { model: Asignatura, where: { eliminado: false }, required: false },
      ],
    });
    res.json(docentes);
  } catch (error) {
    console.error('Error al listar docentes:', error);
    res
      .status(500)
      .json({ error: 'Error al listar los docentes', mensaje: error.message });
  }
};

// Buscar docente por cédula, nombre o ID
export const buscarDocente = async (req, res) => {
  try {
    const { termino } = req.query;

    if (!termino) {
      return res
        .status(400)
        .json({ error: 'Debe proporcionar un término de búsqueda' });
    }

    const docentes = await Docente.findAll({
      where: {
        eliminado: false,
        [Op.or]: [
          { cedula: { [Op.like]: `%${termino}%` } },
          { nombre: { [Op.like]: `%${termino}%` } },
          { apellido: { [Op.like]: `%${termino}%` } },
          { area: { [Op.like]: `%${termino}%` } },
          { id: isNaN(termino) ? null : parseInt(termino) },
        ],
      },
      include: [
        { model: Asignatura, where: { eliminado: false }, required: false },
      ],
    });

    res.status(200).json(docentes);
  } catch (error) {
    console.error('Error al buscar docente:', error);
    res.status(500).json({ error: 'Error al buscar el docente' });
  }
};

// Obtener un docente por ID
export const obtenerDocentePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const docente = await Docente.findOne({
      where: { id, eliminado: false },
      include: [
        { model: Asignatura, where: { eliminado: false }, required: false },
      ],
    });

    if (docente) {
      res.json(docente);
    } else {
      res.status(404).json({ error: 'Docente no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener docente:', error);
    res
      .status(500)
      .json({ error: 'Error al obtener el docente', mensaje: error.message });
  }
};

// Actualizar un docente por ID
export const actualizarDocente = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      cedula,
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      titulo_academico,
      especialidad,
      area,
      carga_horaria,
      estado,
      password, // Nueva contraseña opcional
    } = req.body;

    const docente = await Docente.findByPk(id);

    if (!docente) {
      return res.status(404).json({ error: 'Docente no encontrado' });
    }

    // Verificar si se está cambiando cédula o email a uno ya existente
    if (cedula || email) {
      const existente = await Docente.findOne({
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
          .json({ error: 'Ya existe otro docente con esa cédula o email' });
      }
    }

    // Actualizar campos
    if (cedula) docente.cedula = cedula;
    if (nombre) docente.nombre = nombre;
    if (apellido) docente.apellido = apellido;
    if (email) docente.email = email;
    if (telefono !== undefined) docente.telefono = telefono;
    if (direccion !== undefined) docente.direccion = direccion;
    if (titulo_academico !== undefined)
      docente.titulo_academico = titulo_academico;
    if (especialidad !== undefined) docente.especialidad = especialidad;
    if (area !== undefined) docente.area = area;
    if (carga_horaria !== undefined) docente.carga_horaria = carga_horaria;
    if (estado !== undefined) docente.estado = estado;

    await docente.save();

    // Actualizar contraseña en oauth-api si se proporcionó
    if (password) {
      try {
        console.log('🔐 Actualizando contraseña de docente en oauth-api...');
        console.log('   Email:', docente.email);

        const responseAuth = await fetch(
          `${AUTH_API_URL}/users/actualizar-password-docente`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              docente_id: docente.id,
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
          console.log('✅ Contraseña de docente actualizada exitosamente');
        }
      } catch (authError) {
        console.error('❌ Error de conexión con oauth-api:', authError.message);
      }
    }

    res.json(docente);
  } catch (error) {
    console.error('Error al actualizar docente:', error);
    res.status(500).json({
      error: 'Error al actualizar el docente',
      mensaje: error.message,
    });
  }
};

// Eliminar un docente por ID (soft delete)
export const eliminarDocente = async (req, res) => {
  try {
    const { id } = req.params;
    const docente = await Docente.findOne({
      where: { id, eliminado: false },
    });

    if (docente) {
      docente.eliminado = true;
      docente.estado = 'inactivo';
      await docente.save();
      res.json({ mensaje: 'Docente eliminado correctamente', docente });
    } else {
      res.status(404).json({ error: 'Docente no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar docente:', error);
    res
      .status(500)
      .json({ error: 'Error al eliminar el docente', mensaje: error.message });
  }
};

// Cambiar estado del docente
export const cambiarEstadoDocente = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!['activo', 'inactivo', 'licencia'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const docente = await Docente.findByPk(id);

    if (!docente) {
      return res.status(404).json({ error: 'Docente no encontrado' });
    }

    docente.estado = estado;
    await docente.save();

    res.status(200).json(docente);
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ error: 'Error al cambiar el estado del docente' });
  }
};
