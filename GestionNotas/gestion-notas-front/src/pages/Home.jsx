import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { actividadService } from '../services/actividadService';
import { notificacionService } from '../services/notificacionService';
import { eventoService } from '../services/eventoService';
import { authService } from '../services/authService';

export default function Home() {
  const [actividades, setActividades] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = authService.getCurrentUser();

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    setLoading(true);
    try {
      const [actividadesData, notificacionesData, eventosData] =
        await Promise.all([
          actividadService.listarUltimas(5).catch(() => []),
          notificacionService.listarTodos(null, 5, true).catch(() => []),
          eventoService.obtenerProximos(7).catch(() => []),
        ]);
      setActividades(actividadesData || []);
      setNotificaciones(notificacionesData || []);
      setEventos(eventosData || []);
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
      // Asegurarse de que siempre haya arrays vacíos
      setActividades([]);
      setNotificaciones([]);
      setEventos([]);
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-EC', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTipoColor = (tipo) => {
    const colores = {
      info: 'primary',
      alerta: 'warning',
      exito: 'success',
      error: 'danger',
    };
    return colores[tipo] || 'secondary';
  };

  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        <h1 className="display-5">
          <i className="bi bi-speedometer2"></i> Dashboard - Sistema de Gestión
          de Notas
        </h1>
        <p className="lead text-muted">
          Panel de control e información general del sistema
        </p>
      </div>

      {/* Tarjetas de Acceso Rápido - Solo para Admin y Docente */}
      {user?.rol !== 'estudiante' && (
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <Link to="/estudiantes" className="text-decoration-none">
              <div className="card text-center shadow-sm h-100 border-primary">
                <div className="card-body">
                  <div className="display-4 text-primary">
                    <i className="bi bi-people-fill"></i>
                  </div>
                  <h5 className="card-title mt-2">Estudiantes</h5>
                  <p className="card-text text-muted small">Gestión completa</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-3">
            <Link to="/docentes" className="text-decoration-none">
              <div className="card text-center shadow-sm h-100 border-success">
                <div className="card-body">
                  <div className="display-4 text-success">
                    <i className="bi bi-person-badge-fill"></i>
                  </div>
                  <h5 className="card-title mt-2">Docentes</h5>
                  <p className="card-text text-muted small">Administración</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-3">
            <Link to="/asignaturas" className="text-decoration-none">
              <div className="card text-center shadow-sm h-100 border-info">
                <div className="card-body">
                  <div className="display-4 text-info">
                    <i className="bi bi-book"></i>
                  </div>
                  <h5 className="card-title mt-2">Asignaturas</h5>
                  <p className="card-text text-muted small">Materias</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-3">
            <Link to="/evaluaciones" className="text-decoration-none">
              <div className="card text-center shadow-sm h-100 border-warning">
                <div className="card-body">
                  <div className="display-4 text-warning">
                    <i className="bi bi-clipboard-check-fill"></i>
                  </div>
                  <h5 className="card-title mt-2">Evaluaciones</h5>
                  <p className="card-text text-muted small">Parciales</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Card para Estudiantes - Ver Mi Información */}
      {user?.rol === 'estudiante' && user?.estudiante_id && (
        <div className="row g-3 mb-4">
          <div className="col-md-12">
            <Link
              to={`/estudiante/${user.estudiante_id}`}
              className="text-decoration-none"
            >
              <div className="card text-center shadow-sm border-primary">
                <div className="card-body py-4">
                  <div className="display-4 text-primary mb-3">
                    <i className="bi bi-person-circle"></i>
                  </div>
                  <h4 className="card-title">Mi Información Académica</h4>
                  <p className="card-text text-muted">
                    Ver mis datos personales, notas, evaluaciones y registro
                    académico
                  </p>
                  <button className="btn btn-primary mt-2">
                    <i className="bi bi-eye"></i> Ver Mi Perfil Completo
                  </button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Secciones del Dashboard */}
      <div className="row g-4">
        {/* Actividades Recientes */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-list-task"></i> Actividades Recientes
              </h5>
            </div>
            <div
              className="card-body"
              style={{ maxHeight: '400px', overflowY: 'auto' }}
            >
              {loading ? (
                <div className="text-center py-3">
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  ></div>
                </div>
              ) : actividades.length === 0 ? (
                <p className="text-muted text-center">
                  No hay actividades recientes
                </p>
              ) : (
                <ul className="list-group list-group-flush">
                  {actividades.map((act) => (
                    <li key={act.id} className="list-group-item px-0">
                      <small className="text-muted">
                        {formatearFecha(act.fecha)}
                      </small>
                      <p className="mb-0 small">{act.descripcion}</p>
                      <span className="badge bg-secondary small">
                        {act.tipo}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Notificaciones */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">
                <i className="bi bi-bell-fill"></i> Notificaciones
              </h5>
            </div>
            <div
              className="card-body"
              style={{ maxHeight: '400px', overflowY: 'auto' }}
            >
              {loading ? (
                <div className="text-center py-3">
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  ></div>
                </div>
              ) : notificaciones.length === 0 ? (
                <p className="text-muted text-center">
                  No hay notificaciones nuevas
                </p>
              ) : (
                <div className="list-group list-group-flush">
                  {notificaciones.map((notif) => (
                    <div
                      key={notif.id}
                      className={`list-group-item px-0 border-start border-4 border-${getTipoColor(
                        notif.tipo
                      )}`}
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">{notif.titulo}</h6>
                        <small>{formatearFecha(notif.fecha)}</small>
                      </div>
                      <p className="mb-1 small">{notif.mensaje}</p>
                      <span
                        className={`badge bg-${getTipoColor(notif.tipo)} small`}
                      >
                        {notif.tipo}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Calendario de Eventos */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">
                <i className="bi bi-calendar-event"></i> Próximos Eventos (7
                días)
              </h5>
            </div>
            <div
              className="card-body"
              style={{ maxHeight: '400px', overflowY: 'auto' }}
            >
              {loading ? (
                <div className="text-center py-3">
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  ></div>
                </div>
              ) : eventos.length === 0 ? (
                <p className="text-muted text-center">
                  No hay eventos próximos
                </p>
              ) : (
                <ul className="list-group list-group-flush">
                  {eventos.map((evento) => (
                    <li key={evento.id} className="list-group-item px-0">
                      <h6 className="mb-1">{evento.titulo}</h6>
                      <p className="mb-1 small text-muted">
                        {evento.descripcion}
                      </p>
                      <div className="d-flex gap-2 align-items-center">
                        <span
                          className={`badge bg-${getTipoColor(evento.tipo)}`}
                        >
                          {evento.tipo}
                        </span>
                        <small className="text-muted">
                          {formatearFecha(evento.fecha_inicio)}
                        </small>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Información del Sistema */}
      <div className="alert alert-info mt-4" role="alert">
        <h5 className="alert-heading">ℹ️ Sistema de Evaluación</h5>
        <hr />
        <ul className="mb-0">
          <li>
            <strong>3 parciales por semestre</strong>, cada parcial sobre 14
            puntos
          </li>
          <li>
            <strong>Componentes:</strong> Tarea (20%), Informe (20%), Lección
            (20%), Examen (40%)
          </li>
          <li>
            <strong>Aprobación:</strong> Mínimo 42.10 puntos acumulados (de 42
            posibles)
          </li>
          <li>
            <strong>Reprobación Anticipada:</strong> Si P1 + P2 &lt; 28 puntos
          </li>
        </ul>
      </div>
    </div>
  );
}
