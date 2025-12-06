import express from 'express';
import {
  obtenerRegistroPorEstudiante,
  obtenerEstadoAcademico,
  listarRegistros,
} from '../controllers/registroAcademicoController.js';

const router = express.Router();

router.get('/', listarRegistros);
router.get('/estudiante/:estudianteId', obtenerRegistroPorEstudiante);
router.get('/estudiante/:estudianteId/estado', obtenerEstadoAcademico);

export default router;
