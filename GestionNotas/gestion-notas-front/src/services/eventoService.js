const API_URL = 'http://localhost:3000/api/eventos';

export const eventoService = {
  // Listar todos los eventos
  async listarTodos(filtros = {}) {
    const params = new URLSearchParams(filtros);
    const response = await fetch(`${API_URL}?${params}`);
    if (!response.ok) throw new Error('Error al cargar eventos');
    return await response.json();
  },

  // Obtener eventos próximos
  async obtenerProximos(dias = 7) {
    const response = await fetch(`${API_URL}/proximos?dias=${dias}`);
    if (!response.ok) throw new Error('Error al cargar eventos próximos');
    return await response.json();
  },

  // Crear evento
  async crear(datos) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    if (!response.ok) throw new Error('Error al crear evento');
    return await response.json();
  },

  // Actualizar evento
  async actualizar(id, datos) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    if (!response.ok) throw new Error('Error al actualizar evento');
    return await response.json();
  },

  // Eliminar evento
  async eliminar(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar evento');
    return response.status === 204;
  },
};
