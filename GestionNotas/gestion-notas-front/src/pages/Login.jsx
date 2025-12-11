import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login(email, password);

      // Redirigir según rol
      if (data.user.rol === 'admin') {
        navigate('/');
      } else if (data.user.rol === 'docente') {
        navigate('/');
      } else if (data.user.rol === 'estudiante') {
        navigate(`/estudiante/${data.user.estudiante_id}`);
      }
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="card-body p-4">
          <div className="text-center mb-3">
            <img
              src="/logo.svg"
              alt="Logo"
              style={{ width: '80px' }}
              className="mb-2"
            />
            <h4 className="fw-bold mb-1">Sistema de Gestión de Notas</h4>
            <p className="text-muted small">Inicia sesión para continuar</p>
          </div>

          {error && (
            <div
              className="alert alert-danger alert-dismissible fade show"
              role="alert"
            >
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError('')}
              ></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold small">
                <i className="bi bi-envelope-fill me-2"></i>
                Correo Electrónico
              </label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="usuario@ejemplo.com"
                autoComplete="email"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small">
                <i className="bi bi-lock-fill me-2"></i>
                Contraseña
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  title={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                >
                  <i
                    className={`bi bi-eye${showPassword ? '-slash' : ''}-fill`}
                  ></i>
                </button>
              </div>
            </div>

            <div className="d-grid mb-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Iniciar Sesión
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-3">
            <small className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              ¿Olvidaste tu contraseña? Contacta al administrador
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
