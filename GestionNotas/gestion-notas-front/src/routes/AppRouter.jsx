import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProtectedRoute from '../components/ProtectedRoute';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Estudiantes from '../pages/Estudiantes';
import EstudiantePerfil from '../pages/EstudiantePerfil';
import Docentes from '../pages/Docentes';
import Asignaturas from '../pages/Asignaturas';
import Evaluaciones from '../pages/Evaluaciones';
import PerfilUsuario from '../pages/PerfilUsuario';
import Ayuda from '../pages/Ayuda';
import { authService } from '../services/authService';

function AppContent() {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {/* Solo mostrar navbar si está autenticado Y no está en la página de login */}
      {isAuthenticated && !isLoginPage && <Navbar />}

      <Routes>
        {/* Ruta pública de login */}
        <Route path="/login" element={<Login />} />

        {/* Ruta de inicio (Dashboard) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Rutas de ADMIN */}
        <Route
          path="/estudiantes"
          element={
            <ProtectedRoute rolesPermitidos={['admin']}>
              <Estudiantes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/docentes"
          element={
            <ProtectedRoute rolesPermitidos={['admin']}>
              <Docentes />
            </ProtectedRoute>
          }
        />

        {/* Rutas de ADMIN y DOCENTE */}
        <Route
          path="/asignaturas"
          element={
            <ProtectedRoute rolesPermitidos={['admin', 'docente']}>
              <Asignaturas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/evaluaciones"
          element={
            <ProtectedRoute rolesPermitidos={['admin', 'docente']}>
              <Evaluaciones />
            </ProtectedRoute>
          }
        />

        {/* Rutas de ESTUDIANTE (también admin puede verlas) */}
        <Route
          path="/estudiante/:id"
          element={
            <ProtectedRoute rolesPermitidos={['estudiante', 'admin']}>
              <EstudiantePerfil />
            </ProtectedRoute>
          }
        />

        <Route
          path="/estudiantes/:id/perfil"
          element={
            <ProtectedRoute rolesPermitidos={['admin']}>
              <EstudiantePerfil />
            </ProtectedRoute>
          }
        />

        {/* Rutas comunes (todos los autenticados) */}
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <PerfilUsuario />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ayuda"
          element={
            <ProtectedRoute>
              <Ayuda />
            </ProtectedRoute>
          }
        />

        {/* Redirigir cualquier ruta no encontrada */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />}
        />
      </Routes>
    </>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
