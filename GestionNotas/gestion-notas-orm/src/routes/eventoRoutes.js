import express from 'express';
import {
  crearEvento,
  listarEventos,
  obtenerEventosProximos,
  actualizarEvento,
  eliminarEvento,
} from '../controllers/eventoController.js';

const router = express.Router();

router.post('/', crearEvento);
router.get('/', listarEventos);
router.get('/proximos', obtenerEventosProximos);
router.put('/:id', actualizarEvento);
router.delete('/:id', eliminarEvento);

export default router;
