import { useState, useEffect } from 'react';
import { estudianteService } from '../services/estudianteService';

export default function Estudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [form, setForm] = useState({
    cedula: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    fecha_nacimiento: '',
    carrera: '',
    curso: '',
    paralelo: '',
    estado: 'activo',
  });
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const cargarEstudiantes = async () => {
    setLoading(true);
    try {
      const data = await estudianteService.listarTodos();
      setEstudiantes(data);
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
      alert('Error al cargar estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = async () => {
    if (!busqueda.trim()) {
      cargarEstudiantes();
      return;
    }
    setLoading(true);
    try {
      const data = await estudianteService.buscar(busqueda);
      setEstudiantes(data);
    } catch (error) {
      console.error('Error al buscar:', error);
      alert('Error al buscar estudiante');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.cedula || !form.nombre || !form.apellido || !form.email) {
      alert('Por favor complete los campos obligatorios (Cédula, Nombre, Apellido, Email)');
      return;
    }

    try {
      if (editando) {
        await estudianteService.actualizar(editando, form);
        alert('Estudiante actualizado exitosamente');
      } else {
        await estudianteService.crear(form);
        alert('Estudiante creado exitosamente');
      }
      setForm({
        cedula: '',
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
        fecha_nacimiento: '',
        carrera: '',
        curso: '',
        paralelo: '',
        estado: 'activo',
      });
      setEditando(null);
      cargarEstudiantes();
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error al guardar el estudiante');
    }
  };

  const handleEditar = (estudiante) => {
    setForm({
      cedula: estudiante.cedula || '',
      nombre: estudiante.nombre || '',
      apellido: estudiante.apellido || '',
      email: estudiante.email || '',
      telefono: estudiante.telefono || '',
      direccion: estudiante.direccion || '',
      fecha_nacimiento: estudiante.fecha_nacimiento || '',
      carrera: estudiante.carrera || '',
      curso: estudiante.curso || '',
      paralelo: estudiante.paralelo || '',
      estado: estudiante.estado || 'activo',
    });
    setEditando(estudiante.id);
  };

  const handleEliminar = async (id) => {
    if (
      window.confirm('¿Está seguro de eliminar este estudiante? Esta acción no se puede deshacer.')
    ) {
      try {
        await estudianteService.eliminar(id);
        alert('Estudiante eliminado exitosamente');
        cargarEstudiantes();
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el estudiante');
      }
    }
  };

  const handleCancelar = () => {
    setForm({
      cedula: '',
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      direccion: '',
      fecha_nacimiento: '',
      carrera: '',
      curso: '',
      paralelo: '',
      estado: 'activo',
    });
    setEditando(null);
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      activo: 'success',
      inactivo: 'secondary',
      graduado: 'primary',
      retirado: 'danger',
    };
    return badges[estado] || 'secondary';
  };

  return (
    <div className="container-fluid mt-4">
      <h1 className="mb-4">👨‍🎓 Gestión de Estudiantes</h1>

      {/* Barra de Búsqueda */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por cédula, nombre, apellido o ID..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                />
                <button className="btn btn-primary" onClick={handleBuscar}>
                  🔍 Buscar
                </button>
                <button className="btn btn-secondary" onClick={cargarEstudiantes}>
                  ↻ Todos
                </button>
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="graduado">Graduado</option>
                <option value="retirado">Retirado</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Formulario */}
        <div className="col-md-4">
          <div className="card sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-primary text-white">
              <h5>{editando ? '✏️ Editar Estudiante' : '➕ Nuevo Estudiante'}</h5>
            </div>
            <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Cédula *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.cedula}
                    onChange={(e) => setForm({ ...form, cedula: e.target.value })}
                    maxLength="10"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nombre *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Apellido *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.apellido}
                    onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    maxLength="15"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Dirección</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={form.direccion}
                    onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.fecha_nacimiento}
                    onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Carrera</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.carrera}
                    onChange={(e) => setForm({ ...form, carrera: e.target.value })}
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Curso</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.curso}
                      onChange={(e) => setForm({ ...form, curso: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Paralelo</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.paralelo}
                      onChange={(e) => setForm({ ...form, paralelo: e.target.value })}
                      maxLength="10"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Estado</label>
                  <select
                    className="form-select"
                    value={form.estado}
                    onChange={(e) => setForm({ ...form, estado: e.target.value })}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="graduado">Graduado</option>
                    <option value="retirado">Retirado</option>
                  </select>
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    {editando ? '💾 Actualizar' : '➕ Crear'}
                  </button>
                  {editando && (
                    <button type="button" className="btn btn-secondary" onClick={handleCancelar}>
                      ❌ Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">📋 Lista de Estudiantes</h5>
              <span className="badge bg-light text-dark">{estudiantes.length} registros</span>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : estudiantes.length === 0 ? (
                <p className="text-center text-muted py-5">No hay estudiantes para mostrar</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover table-sm">
                    <thead className="table-light">
                      <tr>
                        <th>Cédula</th>
                        <th>Nombre Completo</th>
                        <th>Email</th>
                        <th>Curso</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estudiantes
                        .filter((est) => !filtroEstado || est.estado === filtroEstado)
                        .map((est) => (
                          <tr key={est.id}>
                            <td>{est.cedula}</td>
                            <td>
                              {est.nombre} {est.apellido}
                            </td>
                            <td>
                              <small>{est.email}</small>
                            </td>
                            <td>
                              {est.curso} {est.paralelo}
                            </td>
                            <td>
                              <span className={`badge bg-${getEstadoBadge(est.estado)}`}>
                                {est.estado}
                              </span>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button
                                  className="btn btn-warning"
                                  onClick={() => handleEditar(est)}
                                  title="Editar"
                                >
                                  ✏️
                                </button>
                                <button
                                  className="btn btn-danger"
                                  onClick={() => handleEliminar(est.id)}
                                  title="Eliminar"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
