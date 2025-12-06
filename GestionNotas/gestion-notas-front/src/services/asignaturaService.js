const API_URL = 'http://localhost:3000/api/asignaturas';

export const asignaturaService = {
  async listarTodos() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al cargar asignaturas');
    return await response.json();
  },

  async obtenerPorId(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Error al obtener asignatura');
    return await response.json();
  },

  async crear(datos) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear asignatura');
    }
    return await response.json();
  },

  async actualizar(id, datos) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    if (!response.ok) throw new Error('Error al actualizar asignatura');
    return await response.json();
  },

  async eliminar(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar asignatura');
    return response.status === 204;
  },
};
