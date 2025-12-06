const API_URL = 'http://localhost:3000/api/docentes';

export const docenteService = {
  // Listar todos los docentes
  async listarTodos() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al cargar docentes');
    return await response.json();
  },

  // Buscar docente por nombre, ID o área
  async buscar(termino) {
    const response = await fetch(`${API_URL}/buscar?termino=${termino}`);
    if (!response.ok) throw new Error('Error al buscar docente');
    return await response.json();
  },

  // Obtener docente por ID
  async obtenerPorId(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Error al obtener docente');
    return await response.json();
  },

  // Crear nuevo docente
  async crear(datos) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear docente');
    }
    return await response.json();
  },

  // Actualizar docente
  async actualizar(id, datos) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    if (!response.ok) throw new Error('Error al actualizar docente');
    return await response.json();
  },

  // Eliminar docente (eliminación lógica)
  async eliminar(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar docente');
    return response.status === 204;
  },

  // Asignar materias
  async asignarMaterias(id, asignaturas) {
    const response = await fetch(`${API_URL}/${id}/asignaturas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ asignaturas }),
    });
    if (!response.ok) throw new Error('Error al asignar materias');
    return await response.json();
  },

  // Cambiar estado del docente
  async cambiarEstado(id, estado) {
    return await this.actualizar(id, { estado });
  },
};
