const API_URL = 'http://localhost:3000/api/actividades';

export const actividadService = {
  // Listar últimas actividades
  async listarUltimas(limite = 10) {
    const response = await fetch(`${API_URL}?limite=${limite}`);
    if (!response.ok) throw new Error('Error al cargar actividades');
    return await response.json();
  },

  // Listar actividades por usuario
  async listarPorUsuario(usuarioId, limite = 20) {
    const response = await fetch(`${API_URL}/usuario/${usuarioId}?limite=${limite}`);
    if (!response.ok) throw new Error('Error al cargar actividades del usuario');
    return await response.json();
  },
};
