const API_URL = 'http://localhost:3000/api/evaluaciones';

export const evaluacionService = {
  // Listar todas las evaluaciones con filtros
  async listarTodos(filtros = {}) {
    const params = new URLSearchParams(filtros);
    const response = await fetch(`${API_URL}?${params}`);
    if (!response.ok) throw new Error('Error al cargar evaluaciones');
    return await response.json();
  },

  // Obtener evaluación por ID
  async obtenerPorId(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Error al obtener evaluación');
    return await response.json();
  },

  // Crear nueva evaluación (parcial con 4 componentes)
  async crear(datos) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear evaluación');
    }
    return await response.json();
  },

  // Actualizar evaluación (recalcula automáticamente)
  async actualizar(id, datos) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    if (!response.ok) throw new Error('Error al actualizar evaluación');
    return await response.json();
  },

  // Eliminar evaluación (eliminación lógica)
  async eliminar(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar evaluación');
    return response.status === 204;
  },

  // Obtener evaluaciones de un estudiante
  async obtenerPorEstudiante(estudianteId) {
    const response = await fetch(`${API_URL}/estudiante/${estudianteId}`);
    if (!response.ok) throw new Error('Error al obtener evaluaciones del estudiante');
    return await response.json();
  },

  // Filtrar por parcial
  async filtrarPorParcial(parcial) {
    return await this.listarTodos({ parcial });
  },

  // Filtrar por asignatura
  async filtrarPorAsignatura(asignaturaId) {
    return await this.listarTodos({ asignaturaId });
  },

  // Filtrar por docente
  async filtrarPorDocente(docenteId) {
    return await this.listarTodos({ docenteId });
  },
};
