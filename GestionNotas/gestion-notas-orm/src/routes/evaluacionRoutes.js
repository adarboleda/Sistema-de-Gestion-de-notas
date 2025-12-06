import express from 'express';
import {
  crearEvaluacion,
  listarEvaluaciones,
  obtenerEvaluacionPorId,
  actualizarEvaluacion,
  eliminarEvaluacion,
  obtenerEvaluacionesPorEstudiante,
} from '../controllers/evaluacionController.js';

const router = express.Router();

router.post('/', crearEvaluacion);
router.get('/', listarEvaluaciones);
router.get('/:id', obtenerEvaluacionPorId);
router.put('/:id', actualizarEvaluacion);
router.delete('/:id', eliminarEvaluacion);
router.get('/estudiante/:estudianteId', obtenerEvaluacionesPorEstudiante);

export default router;
