const API_URL = 'http://localhost:3000/api/notificaciones';

export const notificacionService = {
  // Listar notificaciones
  async listarTodos(destinatarioId = null, limite = 10, soloNoLeidas = false) {
    const params = new URLSearchParams();
    if (destinatarioId) params.append('destinatario_id', destinatarioId);
    params.append('limite', limite);
    params.append('solo_no_leidas', soloNoLeidas);

    const response = await fetch(`${API_URL}?${params}`);
    if (!response.ok) throw new Error('Error al cargar notificaciones');
    return await response.json();
  },

  // Crear notificación
  async crear(datos) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    if (!response.ok) throw new Error('Error al crear notificación');
    return await response.json();
  },

  // Marcar como leída
  async marcarComoLeida(id) {
    const response = await fetch(`${API_URL}/${id}/leer`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Error al marcar notificación');
    return await response.json();
  },

  // Eliminar notificación
  async eliminar(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar notificación');
    return response.status === 204;
  },
};
