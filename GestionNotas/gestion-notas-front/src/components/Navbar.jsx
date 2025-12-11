import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Navbar() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Si no hay usuario, no renderizar nada
  if (!user) {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-journal-bookmark-fill"></i> Sistema de Gestión de
          Notas
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="bi bi-house-door-fill"></i> Dashboard
              </Link>
            </li>

            {/* Solo para ADMIN */}
            {user?.rol === 'admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/estudiantes">
                    <i className="bi bi-person-fill"></i> Estudiantes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/docentes">
                    <i className="bi bi-person-badge-fill"></i> Docentes
                  </Link>
                </li>
              </>
            )}

            {/* Para ADMIN y DOCENTE */}
            {(user?.rol === 'admin' || user?.rol === 'docente') && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/asignaturas">
                    <i className="bi bi-book-fill"></i> Asignaturas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/evaluaciones">
                    <i className="bi bi-clipboard-check-fill"></i> Evaluaciones
                  </Link>
                </li>
              </>
            )}

            {/* Solo para ESTUDIANTE - Link a su perfil académico */}
            {user?.rol === 'estudiante' && user?.estudiante_id && (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to={`/estudiante/${user.estudiante_id}`}
                >
                  <i className="bi bi-person-vcard"></i> Mi Información
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link className="nav-link" to="/ayuda">
                <i className="bi bi-question-circle-fill"></i> Ayuda
              </Link>
            </li>

            {/* Perfil y Logout */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-person-circle"></i>{' '}
                {user?.nombre_completo?.split(' ')[0] || 'Usuario'}
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <h6 className="dropdown-header">
                    <i className="bi bi-shield-check"></i>{' '}
                    {user?.rol?.toUpperCase()}
                  </h6>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link className="dropdown-item" to="/perfil">
                    <i className="bi bi-gear"></i> Mi Perfil
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
