import { Router } from 'express';
import {
  crearEstudiante,
  listarEstudiantes,
  buscarEstudiante,
  obtenerEstudiantePorId,
  actualizarEstudiante,
  eliminarEstudiante,
  cambiarEstadoEstudiante,
} from '../controllers/estudianteController.js';

const router = Router();

// Definición de rutas
router.post('/', crearEstudiante);
router.get('/buscar', buscarEstudiante); // Debe ir antes de /:id
router.get('/', listarEstudiantes);
router.get('/:id', obtenerEstudiantePorId);
router.put('/:id', actualizarEstudiante);
router.put('/:id/estado', cambiarEstadoEstudiante);
router.delete('/:id', eliminarEstudiante);

export default router;
