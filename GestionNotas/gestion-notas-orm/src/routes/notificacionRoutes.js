import express from 'express';
import {
  crearNotificacion,
  listarNotificaciones,
  marcarComoLeida,
  eliminarNotificacion,
} from '../controllers/notificacionController.js';

const router = express.Router();

router.post('/', crearNotificacion);
router.get('/', listarNotificaciones);
router.put('/:id/leer', marcarComoLeida);
router.delete('/:id', eliminarNotificacion);

export default router;
