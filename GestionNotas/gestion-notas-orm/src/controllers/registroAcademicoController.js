import { RegistroAcademico } from '../models/registroAcademico.js';
import { Estudiante } from '../models/estudiante.js';
import { Asignatura } from '../models/asignatura.js';
import { Evaluacion } from '../models/evaluacion.js';

// Obtener el registro académico completo de un estudiante
export const obtenerRegistroPorEstudiante = async (req, res) => {
  try {
    const { estudianteId } = req.params;
    const { periodo } = req.query;

    let where = { estudianteId };
    if (periodo) where.periodo = periodo;

    const registros = await RegistroAcademico.findAll({
      where,
      include: [
        {
          model: Asignatura,
          attributes: ['id', 'nombre', 'codigo', 'creditos'],
        },
      ],
      order: [['periodo', 'DESC']],
    });

    res.json(registros);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Error al obtener el registro académico',
      mensaje: error.message,
    });
  }
};

// Obtener el estado académico detallado del estudiante
export const obtenerEstadoAcademico = async (req, res) => {
  try {
    const { estudianteId } = req.params;
    const { periodo } = req.query;

    let where = { estudianteId };
    if (periodo) where.periodo = periodo;

    // Obtener registros académicos
    const registros = await RegistroAcademico.findAll({
      where,
      include: [
        {
          model: Asignatura,
          attributes: ['id', 'nombre', 'codigo', 'creditos'],
        },
      ],
    });

    // Obtener todas las evaluaciones detalladas
    const evaluaciones = await Evaluacion.findAll({
      where: { estudianteId, eliminado: false },
      include: [
        {
          model: Asignatura,
          attributes: ['id', 'nombre', 'codigo'],
        },
      ],
      order: [
        ['asignaturaId', 'ASC'],
        ['parcial', 'ASC'],
      ],
    });

    // Calcular estadísticas
    const aprobadas = registros.filter((r) => r.estado_semestre === 'aprobado').length;
    const reprobadas = registros.filter(
      (r) => r.estado_semestre === 'reprobado' || r.estado_semestre === 'reprobado_anticipado'
    ).length;
    const enCurso = registros.filter((r) => r.estado_semestre === 'en_curso').length;

    const promedioGeneral =
      registros.length > 0
        ? Number(
            (registros.reduce((sum, r) => sum + r.promedio_final, 0) / registros.length).toFixed(2)
          )
        : 0;

    res.json({
      estudiante_id: estudianteId,
      periodo,
      estadisticas: {
        total_materias: registros.length,
        aprobadas,
        reprobadas,
        en_curso: enCurso,
        promedio_general: promedioGeneral,
      },
      registros,
      evaluaciones_detalladas: evaluaciones,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Error al obtener el estado académico',
      mensaje: error.message,
    });
  }
};

// Listar todos los registros académicos
export const listarRegistros = async (req, res) => {
  try {
    const { periodo } = req.query;
    let where = {};
    if (periodo) where.periodo = periodo;

    const registros = await RegistroAcademico.findAll({
      where,
      include: [
        {
          model: Estudiante,
          attributes: ['id', 'cedula', 'nombre', 'apellido', 'curso', 'paralelo'],
        },
        {
          model: Asignatura,
          attributes: ['id', 'nombre', 'codigo'],
        },
      ],
      order: [['estudiante_id', 'ASC']],
    });

    res.json(registros);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Error al listar los registros académicos',
      mensaje: error.message,
    });
  }
};
