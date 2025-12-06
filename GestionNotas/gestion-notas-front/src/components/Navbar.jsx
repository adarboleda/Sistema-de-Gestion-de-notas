import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-journal-bookmark-fill"></i> Sistema de Gestión de Notas
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
            <li className="nav-item">
              <Link className="nav-link" to="/ayuda">
                <i className="bi bi-question-circle-fill"></i> Ayuda
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
