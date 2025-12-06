import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          📚 Sistema de Gestión de Notas
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
                🏠 Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/estudiantes">
                👨‍🎓 Estudiantes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/docentes">
                👨‍🏫 Docentes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/asignaturas">
                📖 Asignaturas
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/evaluaciones">
                📝 Evaluaciones
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ayuda">
                ❓ Ayuda
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
