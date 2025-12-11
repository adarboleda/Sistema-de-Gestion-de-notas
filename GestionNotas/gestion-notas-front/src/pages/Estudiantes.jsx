import { useState, useEffect } from 'react';
import { estudianteService } from '../services/estudianteService';
import ConfirmModal from '../components/ConfirmModal';
import AlertNotification from '../components/AlertNotification';
import { useAlert, useConfirmModal } from '../hooks/useAlert';

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
    foto: '',
    estado: 'activo',
  });
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Hooks para alertas y modales
  const { alert, showSuccess, showError, showWarning, hideAlert } = useAlert();
  const { modal, showConfirm, hideModal, handleConfirm } = useConfirmModal();

  // Función para convertir archivo a base64
  const convertirArchivoABase64 = (archivo) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(archivo);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Manejar selección de archivo
  const handleFileChange = async (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      if (!archivo.type.startsWith('image/')) {
        showWarning('Por favor seleccione una imagen válida');
        return;
      }
      if (archivo.size > 2 * 1024 * 1024) {
        showWarning('La imagen no debe superar 2MB');
        return;
      }
      try {
        const base64 = await convertirArchivoABase64(archivo);
        setForm({ ...form, foto: base64 });
        showSuccess('Imagen cargada exitosamente');
      } catch (error) {
        showError('Error al cargar la imagen');
      }
    }
  };

  // Manejar drag & drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const archivo = e.dataTransfer.files[0];
      if (!archivo.type.startsWith('image/')) {
        showWarning('Por favor suelte una imagen válida');
        return;
      }
      if (archivo.size > 2 * 1024 * 1024) {
        showWarning('La imagen no debe superar 2MB');
        return;
      }
      try {
        const base64 = await convertirArchivoABase64(archivo);
        setForm({ ...form, foto: base64 });
        showSuccess('Imagen cargada exitosamente');
      } catch (error) {
        showError('Error al cargar la imagen');
      }
    }
  };

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  useEffect(() => {
    cargarEstudiantes();
  }, [filtroEstado]);

  const cargarEstudiantes = async () => {
    setLoading(true);
    try {
      const data = filtroEstado
        ? await estudianteService.listarPorEstado(filtroEstado)
        : await estudianteService.listarTodos();
      setEstudiantes(data);
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
      showError('Error al cargar estudiantes');
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
      if (data.length === 0) {
        showWarning('No se encontraron estudiantes con ese criterio');
      }
    } catch (error) {
      console.error('Error al buscar:', error);
      showError('Error al buscar estudiante');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.cedula ||
      !form.nombre ||
      !form.apellido ||
      !form.email ||
      !form.carrera
    ) {
      showWarning(
        'Por favor complete los campos obligatorios (Cédula, Nombre, Apellido, Email, Carrera)'
      );
      return;
    }

    try {
      if (editando) {
        await estudianteService.actualizar(editando, form);
        showSuccess('Estudiante actualizado exitosamente');
      } else {
        await estudianteService.crear(form);
        showSuccess('Estudiante creado exitosamente');
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
        foto: '',
        estado: 'activo',
      });
      setEditando(null);
      cargarEstudiantes();
    } catch (error) {
      console.error('Error:', error);
      showError(error.message || 'Error al guardar el estudiante');
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
      foto: estudiante.foto || '',
      estado: estudiante.estado || 'activo',
    });
    setEditando(estudiante.id);
  };

  const handleEliminar = (id) => {
    showConfirm(
      'Eliminar Estudiante',
      '¿Está seguro de eliminar este estudiante? Esta acción marcará el registro como eliminado.',
      async () => {
        try {
          await estudianteService.eliminar(id);
          showSuccess('Estudiante eliminado exitosamente');
          cargarEstudiantes();
        } catch (error) {
          console.error('Error:', error);
          showError('Error al eliminar el estudiante');
        }
      },
      'danger'
    );
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
                  <i className="bi bi-search"></i> Buscar
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={cargarEstudiantes}
                >
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
              <h5>
                {editando ? (
                  <>
                    <i className="bi bi-pencil-square"></i> Editar Estudiante
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-plus"></i> Nuevo Estudiante
                  </>
                )}
              </h5>
            </div>
            <div
              className="card-body"
              style={{ maxHeight: '600px', overflowY: 'auto' }}
            >
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Cédula *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.cedula}
                    onChange={(e) =>
                      setForm({ ...form, cedula: e.target.value })
                    }
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
                    onChange={(e) =>
                      setForm({ ...form, nombre: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Apellido *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.apellido}
                    onChange={(e) =>
                      setForm({ ...form, apellido: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={form.telefono}
                    onChange={(e) =>
                      setForm({ ...form, telefono: e.target.value })
                    }
                    maxLength="15"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Dirección</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={form.direccion}
                    onChange={(e) =>
                      setForm({ ...form, direccion: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.fecha_nacimiento}
                    onChange={(e) =>
                      setForm({ ...form, fecha_nacimiento: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Carrera *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.carrera}
                    onChange={(e) =>
                      setForm({ ...form, carrera: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Foto del Estudiante</label>
                  <div
                    className={`border rounded p-3 text-center ${
                      dragActive
                        ? 'border-primary bg-light'
                        : 'border-secondary'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    style={{ cursor: 'pointer', minHeight: '180px' }}
                  >
                    {form.foto ? (
                      <div>
                        <img
                          src={form.foto}
                          alt="Vista previa"
                          className="img-thumbnail mb-2"
                          style={{
                            maxWidth: '150px',
                            maxHeight: '150px',
                            objectFit: 'cover',
                          }}
                          onError={(e) => {
                            e.target.src =
                              'https://via.placeholder.com/150?text=Error+al+cargar';
                          }}
                        />
                        <div>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => setForm({ ...form, foto: '' })}
                          >
                            <i className="bi bi-trash"></i> Eliminar foto
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <i
                          className="bi bi-cloud-upload"
                          style={{ fontSize: '3rem', color: '#6c757d' }}
                        ></i>
                        <p className="mb-2">
                          Arrastra una imagen aquí o haz clic para seleccionar
                        </p>
                        <input
                          type="file"
                          id="fotoInput"
                          className="d-none"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                        <label
                          htmlFor="fotoInput"
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="bi bi-folder2-open"></i> Seleccionar
                          archivo
                        </label>
                        <p className="text-muted small mt-2 mb-0">
                          Máximo 2MB - JPG, PNG, GIF
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Estado</label>
                  <select
                    className="form-select"
                    value={form.estado}
                    onChange={(e) =>
                      setForm({ ...form, estado: e.target.value })
                    }
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="graduado">Graduado</option>
                    <option value="retirado">Retirado</option>
                  </select>
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    {editando ? (
                      <>
                        <i className="bi bi-save"></i> Actualizar
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-lg"></i> Crear
                      </>
                    )}
                  </button>
                  {editando && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancelar}
                    >
                      <i className="bi bi-x-circle"></i> Cancelar
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
              <span className="badge bg-light text-dark">
                {estudiantes.length} registros
              </span>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : estudiantes.length === 0 ? (
                <p className="text-center text-muted py-5">
                  No hay estudiantes para mostrar
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover table-sm">
                    <thead className="table-light">
                      <tr>
                        <th>Foto</th>
                        <th>Cédula</th>
                        <th>Nombre Completo</th>
                        <th>Email</th>
                        <th>Carrera</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estudiantes.map((est) => (
                        <tr key={est.id}>
                          <td>
                            {est.foto ? (
                              <img
                                src={est.foto}
                                alt={`${est.nombre} ${est.apellido}`}
                                className="rounded-circle"
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  objectFit: 'cover',
                                }}
                                onError={(e) => {
                                  e.target.src =
                                    'https://via.placeholder.com/40?text=Sin+Foto';
                                }}
                              />
                            ) : (
                              <div
                                className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  fontSize: '12px',
                                }}
                              >
                                {est.nombre.charAt(0)}
                                {est.apellido.charAt(0)}
                              </div>
                            )}
                          </td>
                          <td>{est.cedula}</td>
                          <td>
                            {est.nombre} {est.apellido}
                          </td>
                          <td>
                            <small>{est.email}</small>
                          </td>
                          <td>
                            <small>{est.carrera}</small>
                          </td>
                          <td>
                            <span
                              className={`badge bg-${getEstadoBadge(
                                est.estado
                              )}`}
                            >
                              {est.estado}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-info"
                                onClick={() =>
                                  (window.location.href = `/estudiantes/${est.id}/perfil`)
                                }
                                title="Ver Perfil"
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                              <button
                                className="btn btn-warning"
                                onClick={() => handleEditar(est)}
                                title="Editar"
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() => handleEliminar(est.id)}
                                title="Eliminar"
                              >
                                <i className="bi bi-trash"></i>
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
