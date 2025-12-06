import express from 'express';
import {
  listarUltimasActividades,
  listarActividadesPorUsuario,
} from '../controllers/actividadController.js';

const router = express.Router();

router.get('/', listarUltimasActividades);
router.get('/usuario/:usuario_id', listarActividadesPorUsuario);

export default router;
