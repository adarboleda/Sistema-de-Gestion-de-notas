import { useState } from 'react';
import { authService } from '../services/authService';
import { useAlert } from '../hooks/useAlert';
import AlertNotification from '../components/AlertNotification';

export default function PerfilUsuario() {
  const user = authService.getCurrentUser();
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const { alert, showSuccess, showError, showWarning, hideAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordNueva !== passwordConfirm) {
      showWarning('Las contraseñas nuevas no coinciden');
      return;
    }

    if (passwordNueva.length < 6) {
      showWarning('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await authService.cambiarPassword(passwordActual, passwordNueva);
      showSuccess('Contraseña cambiada exitosamente');
      setPasswordActual('');
      setPasswordNueva('');
      setPasswordConfirm('');
    } catch (error) {
      showError(error.message || 'Error al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  };

  const getRolBadgeClass = (rol) => {
    switch (rol) {
      case 'admin':
        return 'danger';
      case 'docente':
        return 'info';
      case 'estudiante':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getRolLabel = (rol) => {
    switch (rol) {
      case 'admin':
        return 'Administrador';
      case 'docente':
        return 'Docente';
      case 'estudiante':
        return 'Estudiante';
      default:
        return rol;
    }
  };

  return (
    <div className="container mt-4">
      <AlertNotification alert={alert} onClose={hideAlert} />

      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <i className="bi bi-person-circle"></i> Mi Perfil
              </h4>
            </div>
            <div className="card-body p-4">
              {/* Información del usuario */}
              <div className="mb-4 p-3 bg-light rounded">
                <h5 className="mb-3">
                  <i className="bi bi-info-circle-fill me-2 text-primary"></i>
                  Información Personal
                </h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <p className="mb-1">
                      <strong>
                        <i className="bi bi-person-fill me-2"></i>
                        Nombre:
                      </strong>
                    </p>
                    <p className="text-muted">{user?.nombre_completo}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <p className="mb-1">
                      <strong>
                        <i className="bi bi-envelope-fill me-2"></i>
                        Email:
                      </strong>
                    </p>
                    <p className="text-muted">{user?.email}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <p className="mb-1">
                      <strong>
                        <i className="bi bi-shield-fill-check me-2"></i>
                        Rol:
                      </strong>
                    </p>
                    <span
                      className={`badge bg-${getRolBadgeClass(user?.rol)} fs-6`}
                    >
                      {getRolLabel(user?.rol)}
                    </span>
                  </div>
                  {user?.estudiante_id && (
                    <div className="col-md-6 mb-3">
                      <p className="mb-1">
                        <strong>
                          <i className="bi bi-hash me-2"></i>
                          ID Estudiante:
                        </strong>
                      </p>
                      <p className="text-muted">{user.estudiante_id}</p>
                    </div>
                  )}
                  {user?.docente_id && (
                    <div className="col-md-6 mb-3">
                      <p className="mb-1">
                        <strong>
                          <i className="bi bi-hash me-2"></i>
                          ID Docente:
                        </strong>
                      </p>
                      <p className="text-muted">{user.docente_id}</p>
                    </div>
                  )}
                </div>
              </div>

              <hr className="my-4" />

              {/* Cambiar contraseña */}
              <h5 className="mb-3">
                <i className="bi bi-key-fill me-2 text-warning"></i>
                Cambiar Contraseña
              </h5>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Contraseña Actual
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      className="form-control"
                      value={passwordActual}
                      onChange={(e) => setPasswordActual(e.target.value)}
                      required
                      placeholder="Ingresa tu contraseña actual"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Nueva Contraseña
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock-fill"></i>
                    </span>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      className="form-control"
                      value={passwordNueva}
                      onChange={(e) => setPasswordNueva(e.target.value)}
                      required
                      minLength="6"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                  <small className="text-muted">
                    La contraseña debe tener al menos 6 caracteres
                  </small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Confirmar Nueva Contraseña
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock-fill"></i>
                    </span>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      className="form-control"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      required
                      minLength="6"
                      placeholder="Repite la nueva contraseña"
                    />
                  </div>
                </div>

                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="showPasswords"
                    checked={showPasswords}
                    onChange={(e) => setShowPasswords(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="showPasswords">
                    <i className="bi bi-eye me-1"></i>
                    Mostrar contraseñas
                  </label>
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-warning text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Cambiando contraseña...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Cambiar Contraseña
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
