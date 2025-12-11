const API_URL = 'http://localhost:3000/api/estudiantes';

export const estudianteService = {
  // Listar todos los estudiantes
  async listarTodos() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al cargar estudiantes');
    return await response.json();
  },

  // Listar estudiantes por estado (incluye eliminados si es 'inactivo')
  async listarPorEstado(estado) {
    const url = estado ? `${API_URL}?estado=${estado}` : API_URL;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al cargar estudiantes');
    return await response.json();
  },

  // Buscar estudiante por cédula, nombre o ID
  async buscar(termino) {
    const response = await fetch(`${API_URL}/buscar?termino=${termino}`);
    if (!response.ok) throw new Error('Error al buscar estudiante');
    return await response.json();
  },

  // Obtener estudiante por ID
  async obtenerPorId(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Error al obtener estudiante');
    return await response.json();
  },

  // Crear nuevo estudiante
  async crear(datos) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear estudiante');
    }
    return await response.json();
  },

  // Actualizar estudiante
  async actualizar(id, datos) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    if (!response.ok) throw new Error('Error al actualizar estudiante');
    return await response.json();
  },

  // Eliminar estudiante (eliminación lógica)
  async eliminar(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar estudiante');
    return response.status === 204;
  },

  // Subir foto de estudiante
  async subirFoto(id, archivo) {
    const formData = new FormData();
    formData.append('foto', archivo);

    const response = await fetch(`${API_URL}/${id}/foto`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Error al subir foto');
    return await response.json();
  },

  // Cambiar estado del estudiante
  async cambiarEstado(id, estado) {
    return await this.actualizar(id, { estado });
  },
};
