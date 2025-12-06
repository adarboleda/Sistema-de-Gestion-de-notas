import { useState, useEffect } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import AlertNotification from '../components/AlertNotification';
import { useAlert, useConfirmModal } from '../hooks/useAlert';

export default function Notas() {
  const [notas, setNotas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [form, setForm] = useState({
    nota1: '',
    nota2: '',
    nota3: '',
    estudianteId: '',
    asignaturaId: '',
  });
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);

  // Hooks para alertas y modales
  const { alert, showSuccess, showError, showWarning, hideAlert } = useAlert();
  const { modal, showConfirm, hideModal, handleConfirm } = useConfirmModal();

  const API_URL = 'http://localhost:3000/api/notas';
  const ESTUDIANTES_URL = 'http://localhost:3000/api/estudiantes';
  const ASIGNATURAS_URL = 'http://localhost:3000/api/asignaturas';

  useEffect(() => {
    cargarNotas();
    cargarEstudiantes();
    cargarAsignaturas();
  }, []);

  const cargarNotas = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setNotas(data);
    } catch (error) {
      console.error('Error al cargar notas:', error);
      showError('Error al cargar notas');
    } finally {
      setLoading(false);
    }
  };

  const cargarEstudiantes = async () => {
    try {
      const response = await fetch(ESTUDIANTES_URL);
      const data = await response.json();
      setEstudiantes(data);
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
    }
  };

  const cargarAsignaturas = async () => {
    try {
      const response = await fetch(ASIGNATURAS_URL);
      const data = await response.json();
      setAsignaturas(data);
    } catch (error) {
      console.error('Error al cargar asignaturas:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nota1 || !form.nota2 || !form.nota3 || !form.estudianteId || !form.asignaturaId) {
      showWarning('Por favor complete todos los campos');
      return;
    }

    const datos = {
      nota1: parseFloat(form.nota1),
      nota2: parseFloat(form.nota2),
      nota3: parseFloat(form.nota3),
      estudianteId: parseInt(form.estudianteId),
      asignaturaId: parseInt(form.asignaturaId),
    };

    try {
      if (editando) {
        await fetch(`${API_URL}/${editando}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos),
        });
        showSuccess('Nota actualizada exitosamente');
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos),
        });
        showSuccess('Nota creada exitosamente');
      }
      setForm({
        nota1: '',
        nota2: '',
        nota3: '',
        estudianteId: '',
        asignaturaId: '',
      });
      setEditando(null);
      cargarNotas();
    } catch (error) {
      console.error('Error:', error);
      showError('Error al guardar la nota');
    }
  };

  const handleEditar = (nota) => {
    setForm({
      nota1: nota.nota1.toString(),
      nota2: nota.nota2.toString(),
      nota3: nota.nota3.toString(),
      estudianteId: nota.estudianteId.toString(),
      asignaturaId: nota.asignaturaId.toString(),
    });
    setEditando(nota.id);
  };

  const handleEliminar = (id) => {
    showConfirm(
      'Eliminar Nota',
      '¿Está seguro de eliminar esta nota? Esta acción marcará el registro como eliminado.',
      async () => {
        try {
          await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
          showSuccess('Nota eliminada exitosamente');
          cargarNotas();
        } catch (error) {
          console.error('Error:', error);
          showError('Error al eliminar la nota');
        }
      },
      'danger'
    );
  };

  const handleCancelar = () => {
    setForm({
      nota1: '',
      nota2: '',
      nota3: '',
      estudianteId: '',
      asignaturaId: '',
    });
    setEditando(null);
  };

  const getNombreEstudiante = (estudianteId) => {
    const estudiante = estudiantes.find((e) => e.id === estudianteId);
    return estudiante ? estudiante.nombre : '-';
  };

  const getNombreAsignatura = (asignaturaId) => {
    const asignatura = asignaturas.find((a) => a.id === asignaturaId);
    return asignatura ? asignatura.nombre : '-';
  };

  const getCategoriaClase = (categoria) => {
    switch (categoria) {
      case 'Excelente':
        return 'badge bg-success';
      case 'Bueno':
        return 'badge bg-primary';
      case 'Regular':
        return 'badge bg-warning';
      case 'Insuficiente':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  };

  return (
    <div className="container mt-4">
      {/* Alerta de notificaciones */}
      <AlertNotification
        type={alert.type}
        message={alert.message}
        show={alert.show}
        onClose={hideAlert}
      />

      {/* Modal de confirmación */}
      <ConfirmModal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        onConfirm={handleConfirm}
        onCancel={hideModal}
        variant={modal.variant}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />

      <h1 className="mb-4">Gestión de Notas</h1>

      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5>{editando ? 'Editar Nota' : 'Nueva Nota'}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Estudiante</label>
                  <select
                    className="form-control"
                    value={form.estudianteId}
                    onChange={(e) => setForm({ ...form, estudianteId: e.target.value })}
                    required
                  >
                    <option value="">Seleccione un estudiante</option>
                    {estudiantes.map((est) => (
                      <option key={est.id} value={est.id}>
                        {est.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Asignatura</label>
                  <select
                    className="form-control"
                    value={form.asignaturaId}
                    onChange={(e) => setForm({ ...form, asignaturaId: e.target.value })}
                    required
                  >
                    <option value="">Seleccione una asignatura</option>
                    {asignaturas.map((asig) => (
                      <option key={asig.id} value={asig.id}>
                        {asig.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Nota 1 (0-20)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.nota1}
                    onChange={(e) => setForm({ ...form, nota1: e.target.value })}
                    min="0"
                    max="20"
                    step="0.01"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nota 2 (0-20)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.nota2}
                    onChange={(e) => setForm({ ...form, nota2: e.target.value })}
                    min="0"
                    max="20"
                    step="0.01"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nota 3 (0-20)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.nota3}
                    onChange={(e) => setForm({ ...form, nota3: e.target.value })}
                    min="0"
                    max="20"
                    step="0.01"
                    required
                  />
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
              <h5>Lista de Notas</h5>
            </div>
            <div className="card-body">
              {loading ? (
                <p>Cargando...</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Estudiante</th>
                        <th>Asignatura</th>
                        <th>N1</th>
                        <th>N2</th>
                        <th>N3</th>
                        <th>Promedio</th>
                        <th>Categoría</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notas.map((nota) => (
                        <tr key={nota.id}>
                          <td>{nota.id}</td>
                          <td>{getNombreEstudiante(nota.estudianteId)}</td>
                          <td>{getNombreAsignatura(nota.asignaturaId)}</td>
                          <td>{nota.nota1}</td>
                          <td>{nota.nota2}</td>
                          <td>{nota.nota3}</td>
                          <td>
                            <strong>{nota.promedio.toFixed(2)}</strong>
                          </td>
                          <td>
                            <span className={getCategoriaClase(nota.categoria)}>
                              {nota.categoria}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-warning me-2"
                              onClick={() => handleEditar(nota)}
                            >
                              Editar
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleEliminar(nota.id)}
                            >
                              Eliminar
                            </button>
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
