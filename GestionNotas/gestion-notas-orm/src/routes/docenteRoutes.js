import { Router } from 'express';
import {
  crearDocente,
  listarDocentes,
  buscarDocente,
  obtenerDocentePorId,
  actualizarDocente,
  eliminarDocente,
  cambiarEstadoDocente,
} from '../controllers/docenteController.js';

const router = Router();

// Definición de rutas CRUD para docentes
router.post('/', crearDocente);
router.get('/buscar', buscarDocente); // Debe ir antes de /:id
router.get('/', listarDocentes);
router.get('/:id', obtenerDocentePorId);
router.put('/:id', actualizarDocente);
router.put('/:id/estado', cambiarEstadoDocente);
router.delete('/:id', eliminarDocente);

export default router;
