import { useState, useEffect } from 'react';

export default function Asignaturas() {
  const [asignaturas, setAsignaturas] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    codigo: '',
    creditos: '',
    docenteId: '',
  });
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:3000/api/asignaturas';
  const DOCENTES_URL = 'http://localhost:3000/api/docentes';

  useEffect(() => {
    cargarAsignaturas();
    cargarDocentes();
  }, []);

  const cargarAsignaturas = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setAsignaturas(data);
    } catch (error) {
      console.error('Error al cargar asignaturas:', error);
      alert('Error al cargar asignaturas');
    } finally {
      setLoading(false);
    }
  };

  const cargarDocentes = async () => {
    try {
      const response = await fetch(DOCENTES_URL);
      const data = await response.json();
      setDocentes(data);
    } catch (error) {
      console.error('Error al cargar docentes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.codigo || !form.creditos || !form.docenteId) {
      alert('Por favor complete todos los campos');
      return;
    }

    const datos = {
      ...form,
      creditos: parseInt(form.creditos),
      docenteId: parseInt(form.docenteId),
    };

    try {
      if (editando) {
        await fetch(`${API_URL}/${editando}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos),
        });
        alert('Asignatura actualizada exitosamente');
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos),
        });
        alert('Asignatura creada exitosamente');
      }
      setForm({ nombre: '', codigo: '', creditos: '', docenteId: '' });
      setEditando(null);
      cargarAsignaturas();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar la asignatura');
    }
  };

  const handleEditar = (asignatura) => {
    setForm({
      nombre: asignatura.nombre,
      codigo: asignatura.codigo,
      creditos: asignatura.creditos.toString(),
      docenteId: asignatura.docenteId.toString(),
    });
    setEditando(asignatura.id);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta asignatura?')) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        alert('Asignatura eliminada exitosamente');
        cargarAsignaturas();
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar la asignatura');
      }
    }
  };

  const handleCancelar = () => {
    setForm({ nombre: '', codigo: '', creditos: '', docenteId: '' });
    setEditando(null);
  };

  const getNombreDocente = (docenteId) => {
    const docente = docentes.find((d) => d.id === docenteId);
    return docente ? `${docente.nombre} ${docente.apellido}` : '-';
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Gestión de Asignaturas</h1>

      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5>{editando ? 'Editar Asignatura' : 'Nueva Asignatura'}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Código</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.codigo}
                    onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Créditos</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.creditos}
                    onChange={(e) => setForm({ ...form, creditos: e.target.value })}
                    min="1"
                    max="10"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Docente</label>
                  <select
                    className="form-control"
                    value={form.docenteId}
                    onChange={(e) => setForm({ ...form, docenteId: e.target.value })}
                    required
                  >
                    <option value="">Seleccione un docente</option>
                    {docentes.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.nombre} {doc.apellido}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    {editando ? 'Actualizar' : 'Crear'}
                  </button>
                  {editando && (
                    <button type="button" className="btn btn-secondary" onClick={handleCancelar}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h5>Lista de Asignaturas</h5>
            </div>
            <div className="card-body">
              {loading ? (
                <p>Cargando...</p>
              ) : (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Código</th>
                      <th>Créditos</th>
                      <th>Docente</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asignaturas.map((asig) => (
                      <tr key={asig.id}>
                        <td>{asig.id}</td>
                        <td>{asig.nombre}</td>
                        <td>{asig.codigo}</td>
                        <td>{asig.creditos}</td>
                        <td>{getNombreDocente(asig.docenteId)}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => handleEditar(asig)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleEliminar(asig.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
