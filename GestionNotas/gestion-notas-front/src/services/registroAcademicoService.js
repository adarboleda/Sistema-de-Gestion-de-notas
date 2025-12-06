const API_URL = 'http://localhost:3000/api/registro-academico';

export const registroAcademicoService = {
  // Obtener registro académico de un estudiante
  async obtenerPorEstudiante(estudianteId, periodo = null) {
    const params = periodo ? `?periodo=${periodo}` : '';
    const response = await fetch(`${API_URL}/estudiante/${estudianteId}${params}`);
    if (!response.ok) throw new Error('Error al cargar registro académico');
    return await response.json();
  },

  // Obtener estado académico completo con estadísticas
  async obtenerEstadoAcademico(estudianteId, periodo = null) {
    const params = periodo ? `?periodo=${periodo}` : '';
    const response = await fetch(`${API_URL}/estudiante/${estudianteId}/estado${params}`);
    if (!response.ok) throw new Error('Error al cargar estado académico');
    return await response.json();
  },

  // Listar todos los registros académicos
  async listarTodos(periodo = null) {
    const params = periodo ? `?periodo=${periodo}` : '';
    const response = await fetch(`${API_URL}${params}`);
    if (!response.ok) throw new Error('Error al cargar registros académicos');
    return await response.json();
  },
};
