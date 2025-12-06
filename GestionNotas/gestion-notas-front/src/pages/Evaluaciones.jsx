import { useState, useEffect } from 'react';
import { evaluacionService } from '../services/evaluacionService';
import { estudianteService } from '../services/estudianteService';
import { asignaturaService } from '../services/asignaturaService';
import { docenteService } from '../services/docenteService';

export default function Evaluaciones() {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [form, setForm] = useState({
    estudianteId: '',
    asignaturaId: '',
    docenteId: '',
    parcial: 1,
    tarea: '',
    informe: '',
    leccion: '',
    examen: '',
    observaciones: '',
  });
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtroParcial, setFiltroParcial] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [evalData, estData, asigData, docData] = await Promise.all([
        evaluacionService.listarTodos(),
        estudianteService.listarTodos(),
        asignaturaService.listarTodos(),
        docenteService.listarTodos(),
      ]);
      setEvaluaciones(evalData);
      setEstudiantes(estData);
      setAsignaturas(asigData);
      setDocentes(docData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const calcularNotaParcial = () => {
    const { tarea, informe, leccion, examen } = form;
    if (!tarea || !informe || !leccion || !examen) return '-';

    const t = parseFloat(tarea) || 0;
    const i = parseFloat(informe) || 0;
    const l = parseFloat(leccion) || 0;
    const e = parseFloat(examen) || 0;

    const nota = (t * 0.2 + i * 0.2 + l * 0.2 + e * 0.4).toFixed(2);
    return nota;
  };

  const calcularNotaSobre14 = () => {
    const notaParcial = calcularNotaParcial();
    if (notaParcial === '-') return '-';

    const nota14 = ((parseFloat(notaParcial) / 20) * 14).toFixed(2);
    return nota14;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.estudianteId || !form.asignaturaId || !form.docenteId) {
      alert('Por favor seleccione estudiante, asignatura y docente');
      return;
    }

    if (!form.tarea || !form.informe || !form.leccion || !form.examen) {
      alert('Por favor complete todas las notas (Tarea, Informe, Lección, Examen)');
      return;
    }

    const datos = {
      ...form,
      tarea: parseFloat(form.tarea),
      informe: parseFloat(form.informe),
      leccion: parseFloat(form.leccion),
      examen: parseFloat(form.examen),
    };

    try {
      if (editando) {
        await evaluacionService.actualizar(editando, datos);
        alert('Evaluación actualizada exitosamente');
      } else {
        await evaluacionService.crear(datos);
        alert(
          'Evaluación creada exitosamente. El registro académico se actualizó automáticamente.'
        );
      }
      resetForm();
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error al guardar la evaluación');
    }
  };

  const handleEditar = (evaluacion) => {
    setForm({
      estudianteId: evaluacion.estudianteId,
      asignaturaId: evaluacion.asignaturaId,
      docenteId: evaluacion.docenteId,
      parcial: evaluacion.parcial,
      tarea: evaluacion.tarea,
      informe: evaluacion.informe,
      leccion: evaluacion.leccion,
      examen: evaluacion.examen,
      observaciones: evaluacion.observaciones || '',
    });
    setEditando(evaluacion.id);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta evaluación?')) {
      try {
        await evaluacionService.eliminar(id);
        alert('Evaluación eliminada exitosamente');
        cargarDatos();
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar la evaluación');
      }
    }
  };

  const resetForm = () => {
    setForm({
      estudianteId: '',
      asignaturaId: '',
      docenteId: '',
      parcial: 1,
      tarea: '',
      informe: '',
      leccion: '',
      examen: '',
      observaciones: '',
    });
    setEditando(null);
  };

  const getEstadoBadge = (estado) => {
    return estado === 'aprobado' ? 'success' : estado === 'reprobado' ? 'danger' : 'warning';
  };

  const evaluacionesFiltradas = evaluaciones.filter(
    (e) => !filtroParcial || e.parcial === parseInt(filtroParcial)
  );

  return (
    <div className="container-fluid mt-4">
      <h1 className="mb-4">📝 Gestión de Evaluaciones (Sistema de Parciales)</h1>

      {/* Información del Sistema */}
      <div className="alert alert-info mb-4">
        <h5 className="alert-heading">ℹ️ Sistema de Evaluación</h5>
        <div className="row">
          <div className="col-md-6">
            <ul className="mb-0">
              <li>
                <strong>3 Parciales</strong> por semestre
              </li>
              <li>
                Cada parcial sobre <strong>20 puntos</strong>
              </li>
              <li>
                Convertido a <strong>14 puntos</strong> automáticamente
              </li>
            </ul>
          </div>
          <div className="col-md-6">
            <strong>Componentes (sobre 20 pts c/u):</strong>
            <ul className="mb-0">
              <li>Tarea: 20%</li>
              <li>Informe: 20%</li>
              <li>Lección: 20%</li>
              <li>Examen: 40%</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Filtrar por Parcial:</label>
              <select
                className="form-select"
                value={filtroParcial}
                onChange={(e) => setFiltroParcial(e.target.value)}
              >
                <option value="">Todos los parciales</option>
                <option value="1">Parcial 1</option>
                <option value="2">Parcial 2</option>
                <option value="3">Parcial 3</option>
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
              <h5>{editando ? '✏️ Editar Evaluación' : '➕ Nueva Evaluación'}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Estudiante *</label>
                  <select
                    className="form-select"
                    value={form.estudianteId}
                    onChange={(e) => setForm({ ...form, estudianteId: e.target.value })}
                    required
                  >
                    <option value="">Seleccione un estudiante</option>
                    {estudiantes.map((est) => (
                      <option key={est.id} value={est.id}>
                        {est.cedula} - {est.nombre} {est.apellido}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Asignatura *</label>
                  <select
                    className="form-select"
                    value={form.asignaturaId}
                    onChange={(e) => setForm({ ...form, asignaturaId: e.target.value })}
                    required
                  >
                    <option value="">Seleccione una asignatura</option>
                    {asignaturas.map((asig) => (
                      <option key={asig.id} value={asig.id}>
                        {asig.codigo} - {asig.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Docente *</label>
                  <select
                    className="form-select"
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

                <div className="mb-3">
                  <label className="form-label">Parcial *</label>
                  <select
                    className="form-select"
                    value={form.parcial}
                    onChange={(e) => setForm({ ...form, parcial: parseInt(e.target.value) })}
                    required
                  >
                    <option value="1">Parcial 1</option>
                    <option value="2">Parcial 2</option>
                    <option value="3">Parcial 3</option>
                  </select>
                </div>

                <hr />
                <h6 className="text-center mb-3">📋 Componentes del Parcial</h6>

                <div className="mb-3">
                  <label className="form-label">
                    Tarea * <span className="badge bg-secondary">20%</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.tarea}
                    onChange={(e) => setForm({ ...form, tarea: e.target.value })}
                    min="0"
                    max="20"
                    step="0.01"
                    placeholder="Nota sobre 20"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Informe * <span className="badge bg-secondary">20%</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.informe}
                    onChange={(e) => setForm({ ...form, informe: e.target.value })}
                    min="0"
                    max="20"
                    step="0.01"
                    placeholder="Nota sobre 20"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Lección * <span className="badge bg-secondary">20%</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.leccion}
                    onChange={(e) => setForm({ ...form, leccion: e.target.value })}
                    min="0"
                    max="20"
                    step="0.01"
                    placeholder="Nota sobre 20"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Examen * <span className="badge bg-primary">40%</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.examen}
                    onChange={(e) => setForm({ ...form, examen: e.target.value })}
                    min="0"
                    max="20"
                    step="0.01"
                    placeholder="Nota sobre 20"
                    required
                  />
                </div>

                {/* Cálculos en Tiempo Real */}
                <div className="alert alert-success">
                  <div className="d-flex justify-content-between">
                    <strong>Nota Parcial (/20):</strong>
                    <span>{calcularNotaParcial()}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <strong>Nota sobre 14:</strong>
                    <span className="text-primary fs-5">{calcularNotaSobre14()}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Observaciones</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={form.observaciones}
                    onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                  />
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    {editando ? '💾 Actualizar' : '➕ Crear Evaluación'}
                  </button>
                  {editando && (
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
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
              <h5 className="mb-0">📋 Lista de Evaluaciones</h5>
              <span className="badge bg-light text-dark">
                {evaluacionesFiltradas.length} registros
              </span>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : evaluacionesFiltradas.length === 0 ? (
                <p className="text-center text-muted py-5">No hay evaluaciones para mostrar</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover table-sm">
                    <thead className="table-light">
                      <tr>
                        <th>Parcial</th>
                        <th>Estudiante</th>
                        <th>Asignatura</th>
                        <th className="text-center">T</th>
                        <th className="text-center">I</th>
                        <th className="text-center">L</th>
                        <th className="text-center">E</th>
                        <th className="text-center">Nota/20</th>
                        <th className="text-center">Nota/14</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evaluacionesFiltradas.map((evaluacion) => {
                        const estudiante = estudiantes.find(
                          (e) => e.id === evaluacion.estudianteId
                        );
                        const asignatura = asignaturas.find(
                          (a) => a.id === evaluacion.asignaturaId
                        );
                        return (
                          <tr key={evaluacion.id}>
                            <td>
                              <span className="badge bg-primary">P{evaluacion.parcial}</span>
                            </td>
                            <td>
                              <small>
                                {estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : '-'}
                              </small>
                            </td>
                            <td>
                              <small>{asignatura ? asignatura.nombre : '-'}</small>
                            </td>
                            <td className="text-center">{evaluacion.tarea}</td>
                            <td className="text-center">{evaluacion.informe}</td>
                            <td className="text-center">{evaluacion.leccion}</td>
                            <td className="text-center">
                              <strong>{evaluacion.examen}</strong>
                            </td>
                            <td className="text-center">{evaluacion.nota_parcial}</td>
                            <td className="text-center">
                              <strong className="text-primary">{evaluacion.nota_sobre_14}</strong>
                            </td>
                            <td>
                              <span className={`badge bg-${getEstadoBadge(evaluacion.estado)}`}>
                                {evaluacion.estado}
                              </span>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button
                                  className="btn btn-warning"
                                  onClick={() => handleEditar(evaluacion)}
                                  title="Editar"
                                >
                                  ✏️
                                </button>
                                <button
                                  className="btn btn-danger"
                                  onClick={() => handleEliminar(evaluacion.id)}
                                  title="Eliminar"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
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
