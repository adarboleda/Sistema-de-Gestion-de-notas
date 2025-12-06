import { Evaluacion } from '../models/evaluacion.js';
import { Estudiante } from '../models/estudiante.js';
import { Asignatura } from '../models/asignatura.js';
import { Docente } from '../models/docente.js';
import { RegistroAcademico } from '../models/registroAcademico.js';

/**
 * Calcula la nota final de un parcial según los porcentajes:
 * - Tarea: 20% sobre 20 puntos
 * - Informe: 20% sobre 20 puntos
 * - Lección: 20% sobre 20 puntos
 * - Examen: 40% sobre 20 puntos
 * Total: nota sobre 20 puntos
 */
function calcularNotaParcial(tarea, informe, leccion, examen) {
  const aporteTarea = tarea * 0.2;
  const aporteInforme = informe * 0.2;
  const aporteLeccion = leccion * 0.2;
  const aporteExamen = examen * 0.4;

  const notaFinal = aporteTarea + aporteInforme + aporteLeccion + aporteExamen;
  return Number(notaFinal.toFixed(2));
}

/**
 * Convierte la nota de 20 puntos a 14 puntos
 */
function convertirA14Puntos(notaSobre20) {
  const conversion = (notaSobre20 / 20) * 14;
  return Number(conversion.toFixed(2));
}

/**
 * Determina el estado del parcial
 */
function determinarEstadoParcial(notaSobre14) {
  if (notaSobre14 >= 9.8) {
    // 70% de 14 = 9.8 (equivale a 14/20)
    return 'aprobado';
  } else {
    return 'reprobado';
  }
}

// Crear una nueva evaluación (parcial con sus 4 componentes)
export const crearEvaluacion = async (req, res) => {
  try {
    const {
      estudianteId,
      asignaturaId,
      docenteId,
      parcial,
      tarea,
      informe,
      leccion,
      examen,
      observaciones,
      fecha_evaluacion,
    } = req.body;

    // Validaciones
    if (!estudianteId || !asignaturaId || !docenteId || !parcial) {
      return res.status(400).json({
        error:
          'Faltan datos obligatorios: estudianteId, asignaturaId, docenteId y parcial son requeridos',
      });
    }

    // Validar que las notas estén en el rango correcto (0-20)
    const notas = [tarea, informe, leccion, examen];
    if (notas.some((n) => n < 0 || n > 20)) {
      return res.status(400).json({
        error: 'Todas las notas deben estar en el rango de 0 a 20',
      });
    }

    // Calcular la nota del parcial sobre 20 puntos
    const notaParcial = calcularNotaParcial(tarea, informe, leccion, examen);

    // Convertir a 14 puntos
    const notaSobre14 = convertirA14Puntos(notaParcial);

    // Determinar estado
    const estado = determinarEstadoParcial(notaSobre14);

    // Verificar si ya existe una evaluación para este estudiante en esta asignatura y parcial
    const evaluacionExistente = await Evaluacion.findOne({
      where: { estudianteId, asignaturaId, parcial, eliminado: false },
    });

    if (evaluacionExistente) {
      return res.status(400).json({
        error: 'Ya existe una evaluación para este estudiante en esta asignatura y parcial',
      });
    }

    // Crear la evaluación
    const nuevaEvaluacion = await Evaluacion.create({
      estudianteId,
      asignaturaId,
      docenteId,
      parcial,
      tarea,
      informe,
      leccion,
      examen,
      nota_parcial: notaParcial,
      nota_sobre_14: notaSobre14,
      estado,
      observaciones,
      fecha_evaluacion: fecha_evaluacion || new Date(),
    });

    // Actualizar el registro académico del estudiante
    await actualizarRegistroAcademico(estudianteId, asignaturaId);

    res.status(201).json(nuevaEvaluacion);
  } catch (error) {
    console.error('Error al crear evaluación:', error);
    res.status(500).json({
      error: 'Error al crear la evaluación',
      mensaje: error.message,
    });
  }
};

// Actualizar el registro académico después de ingresar un parcial
async function actualizarRegistroAcademico(estudianteId, asignaturaId) {
  try {
    // Obtener todas las evaluaciones del estudiante en esta asignatura
    const evaluaciones = await Evaluacion.findAll({
      where: { estudianteId, asignaturaId, eliminado: false },
      order: [['parcial', 'ASC']],
    });

    if (evaluaciones.length === 0) return;

    // Obtener o crear el registro académico
    const periodo = '2024-2'; // Esto debería venir de configuración
    let registro = await RegistroAcademico.findOne({
      where: { estudianteId, asignaturaId, periodo },
    });

    if (!registro) {
      registro = await RegistroAcademico.create({
        estudianteId,
        asignaturaId,
        periodo,
      });
    }

    // Actualizar las notas de cada parcial
    evaluaciones.forEach((evaluacion) => {
      if (evaluacion.parcial === 1) registro.parcial_1 = evaluacion.nota_sobre_14;
      if (evaluacion.parcial === 2) registro.parcial_2 = evaluacion.nota_sobre_14;
      if (evaluacion.parcial === 3) registro.parcial_3 = evaluacion.nota_sobre_14;
    });

    // Calcular suma de parciales
    const suma = (registro.parcial_1 || 0) + (registro.parcial_2 || 0) + (registro.parcial_3 || 0);
    registro.suma_parciales = suma;

    // Verificar reprobación anticipada (P1 + P2 < 28)
    const sumaP1P2 = (registro.parcial_1 || 0) + (registro.parcial_2 || 0);
    if (sumaP1P2 < 28 && registro.parcial_2 > 0) {
      registro.reprobado_anticipado = true;
      registro.estado_semestre = 'reprobado_anticipado';
    } else if (registro.parcial_3 > 0) {
      // Si ya tiene los 3 parciales, determinar estado final
      if (suma >= 42.1) {
        registro.estado_semestre = 'aprobado';
      } else {
        registro.estado_semestre = 'reprobado';
      }
    } else {
      registro.estado_semestre = 'en_curso';
    }

    // Calcular promedio final sobre 20 puntos
    registro.promedio_final = Number(((suma / 42) * 20).toFixed(2));

    await registro.save();
  } catch (error) {
    console.error('Error al actualizar registro académico:', error);
  }
}

// Listar todas las evaluaciones con filtros
export const listarEvaluaciones = async (req, res) => {
  try {
    const { estudianteId, docenteId, asignaturaId, parcial, curso, fecha } = req.query;

    let where = { eliminado: false };

    if (estudianteId) where.estudianteId = estudianteId;
    if (docenteId) where.docenteId = docenteId;
    if (asignaturaId) where.asignaturaId = asignaturaId;
    if (parcial) where.parcial = parcial;

    const evaluaciones = await Evaluacion.findAll({
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
        {
          model: Docente,
          attributes: ['id', 'nombre', 'apellido'],
        },
      ],
      order: [['fecha_evaluacion', 'DESC']],
    });

    res.json(evaluaciones);
  } catch (error) {
    console.error('Error al listar evaluaciones:', error);
    res.status(500).json({
      error: 'Error al listar las evaluaciones',
      mensaje: error.message,
    });
  }
};

// Obtener una evaluación por ID
export const obtenerEvaluacionPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const evaluacion = await Evaluacion.findOne({
      where: { id, eliminado: false },
      include: [{ model: Estudiante }, { model: Asignatura }, { model: Docente }],
    });

    if (evaluacion) {
      res.json(evaluacion);
    } else {
      res.status(404).json({ error: 'Evaluación no encontrada' });
    }
  } catch (error) {
    console.error('Error al obtener evaluación:', error);
    res.status(500).json({
      error: 'Error al obtener la evaluación',
      mensaje: error.message,
    });
  }
};

// Actualizar una evaluación
export const actualizarEvaluacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { tarea, informe, leccion, examen, observaciones, modificado_por } = req.body;

    const evaluacion = await Evaluacion.findOne({
      where: { id, eliminado: false },
    });

    if (!evaluacion) {
      return res.status(404).json({ error: 'Evaluación no encontrada' });
    }

    // Actualizar componentes si se proporcionan
    if (tarea !== undefined) evaluacion.tarea = tarea;
    if (informe !== undefined) evaluacion.informe = informe;
    if (leccion !== undefined) evaluacion.leccion = leccion;
    if (examen !== undefined) evaluacion.examen = examen;
    if (observaciones !== undefined) evaluacion.observaciones = observaciones;
    if (modificado_por !== undefined) evaluacion.modificado_por = modificado_por;

    // Recalcular nota del parcial
    evaluacion.nota_parcial = calcularNotaParcial(
      evaluacion.tarea,
      evaluacion.informe,
      evaluacion.leccion,
      evaluacion.examen
    );

    // Recalcular nota sobre 14
    evaluacion.nota_sobre_14 = convertirA14Puntos(evaluacion.nota_parcial);

    // Actualizar estado
    evaluacion.estado = determinarEstadoParcial(evaluacion.nota_sobre_14);

    await evaluacion.save();

    // Actualizar el registro académico
    await actualizarRegistroAcademico(evaluacion.estudianteId, evaluacion.asignaturaId);

    res.json(evaluacion);
  } catch (error) {
    console.error('Error al actualizar evaluación:', error);
    res.status(500).json({
      error: 'Error al actualizar la evaluación',
      mensaje: error.message,
    });
  }
};

// Eliminar evaluación (eliminación lógica)
export const eliminarEvaluacion = async (req, res) => {
  try {
    const { id } = req.params;
    const evaluacion = await Evaluacion.findOne({
      where: { id, eliminado: false },
    });

    if (!evaluacion) {
      return res.status(404).json({ error: 'Evaluación no encontrada' });
    }

    // Eliminación lógica
    evaluacion.eliminado = true;
    await evaluacion.save();

    // Actualizar el registro académico
    await actualizarRegistroAcademico(evaluacion.estudianteId, evaluacion.asignaturaId);

    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar evaluación:', error);
    res.status(500).json({
      error: 'Error al eliminar la evaluación',
      mensaje: error.message,
    });
  }
};

// Obtener evaluaciones por estudiante
export const obtenerEvaluacionesPorEstudiante = async (req, res) => {
  try {
    const { estudianteId } = req.params;

    const evaluaciones = await Evaluacion.findAll({
      where: { estudianteId, eliminado: false },
      include: [
        {
          model: Asignatura,
          attributes: ['id', 'nombre', 'codigo'],
        },
        {
          model: Docente,
          attributes: ['id', 'nombre', 'apellido'],
        },
      ],
      order: [
        ['asignaturaId', 'ASC'],
        ['parcial', 'ASC'],
      ],
    });

    res.json(evaluaciones);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Error al obtener evaluaciones del estudiante',
      mensaje: error.message,
    });
  }
};
