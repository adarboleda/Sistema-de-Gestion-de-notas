import { useState, useEffect } from 'react';
import { docenteService } from '../services/docenteService';

export default function Docentes() {
  const [docentes, setDocentes] = useState([]);
  const [form, setForm] = useState({
    cedula: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    titulo_academico: '',
    especialidad: '',
    area: '',
    carga_horaria: 0,
    estado: 'activo',
  });
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarDocentes();
  }, []);

  const cargarDocentes = async () => {
    setLoading(true);
    try {
      const data = await docenteService.listarTodos();
      setDocentes(data);
    } catch (error) {
      console.error('Error al cargar docentes:', error);
      alert('Error al cargar docentes');
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = async () => {
    if (!busqueda.trim()) {
      cargarDocentes();
      return;
    }
    setLoading(true);
    try {
      const data = await docenteService.buscar(busqueda);
      setDocentes(data);
    } catch (error) {
      console.error('Error al buscar:', error);
      alert('Error al buscar docente');
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
        await docenteService.actualizar(editando, form);
        alert('Docente actualizado exitosamente');
      } else {
        await docenteService.crear(form);
        alert('Docente creado exitosamente');
      }
      setForm({
        cedula: '',
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
        titulo_academico: '',
        especialidad: '',
        area: '',
        carga_horaria: 0,
        estado: 'activo',
      });
      setEditando(null);
      cargarDocentes();
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error al guardar el docente');
    }
  };

  const handleEditar = (docente) => {
    setForm({
      cedula: docente.cedula || '',
      nombre: docente.nombre || '',
      apellido: docente.apellido || '',
      email: docente.email || '',
      telefono: docente.telefono || '',
      direccion: docente.direccion || '',
      titulo_academico: docente.titulo_academico || '',
      especialidad: docente.especialidad || '',
      area: docente.area || '',
      carga_horaria: docente.carga_horaria || 0,
      estado: docente.estado || 'activo',
    });
    setEditando(docente.id);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este docente?')) {
      try {
        await docenteService.eliminar(id);
        alert('Docente eliminado exitosamente');
        cargarDocentes();
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el docente');
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
      titulo_academico: '',
      especialidad: '',
      area: '',
      carga_horaria: 0,
      estado: 'activo',
    });
    setEditando(null);
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      activo: 'success',
      inactivo: 'secondary',
      licencia: 'warning',
    };
    return badges[estado] || 'secondary';
  };

  return (
    <div className="container-fluid mt-4">
      <h1 className="mb-4">👨‍🏫 Gestión de Docentes</h1>

      {/* Barra de Búsqueda */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por cédula, nombre, área o ID..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
            />
            <button className="btn btn-primary" onClick={handleBuscar}>
              🔍 Buscar
            </button>
            <button className="btn btn-secondary" onClick={cargarDocentes}>
              ↻ Todos
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Formulario */}
        <div className="col-md-4">
          <div className="card sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-primary text-white">
              <h5>{editando ? '✏️ Editar Docente' : '➕ Nuevo Docente'}</h5>
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
                  <label className="form-label">Título Académico</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.titulo_academico}
                    onChange={(e) => setForm({ ...form, titulo_academico: e.target.value })}
                    placeholder="Ej: Ingeniero, Licenciado, PhD"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Especialidad</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.especialidad}
                    onChange={(e) => setForm({ ...form, especialidad: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Área</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    placeholder="Ej: Matemáticas, Ciencias"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Carga Horaria (horas/semana)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.carga_horaria}
                    onChange={(e) =>
                      setForm({ ...form, carga_horaria: parseInt(e.target.value) || 0 })
                    }
                    min="0"
                    max="60"
                  />
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
                    <option value="licencia">Licencia</option>
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
              <h5 className="mb-0">📋 Lista de Docentes</h5>
              <span className="badge bg-light text-dark">{docentes.length} registros</span>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : docentes.length === 0 ? (
                <p className="text-center text-muted py-5">No hay docentes para mostrar</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover table-sm">
                    <thead className="table-light">
                      <tr>
                        <th>Cédula</th>
                        <th>Nombre Completo</th>
                        <th>Email</th>
                        <th>Área</th>
                        <th>Carga (h/s)</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {docentes.map((doc) => (
                        <tr key={doc.id}>
                          <td>{doc.cedula}</td>
                          <td>
                            {doc.nombre} {doc.apellido}
                          </td>
                          <td>
                            <small>{doc.email}</small>
                          </td>
                          <td>{doc.area || '-'}</td>
                          <td className="text-center">{doc.carga_horaria || 0}</td>
                          <td>
                            <span className={`badge bg-${getEstadoBadge(doc.estado)}`}>
                              {doc.estado}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-warning"
                                onClick={() => handleEditar(doc)}
                                title="Editar"
                              >
                                ✏️
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() => handleEliminar(doc.id)}
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
