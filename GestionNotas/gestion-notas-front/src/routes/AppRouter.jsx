import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Home from '../pages/Home';
import Estudiantes from '../pages/Estudiantes';
import EstudiantePerfil from '../pages/EstudiantePerfil';
import Docentes from '../pages/Docentes';
import Asignaturas from '../pages/Asignaturas';
import Evaluaciones from '../pages/Evaluaciones';
import Ayuda from '../pages/Ayuda';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/estudiantes" element={<Estudiantes />} />
        <Route path="/estudiantes/:id/perfil" element={<EstudiantePerfil />} />
        <Route path="/docentes" element={<Docentes />} />
        <Route path="/asignaturas" element={<Asignaturas />} />
        <Route path="/evaluaciones" element={<Evaluaciones />} />
        <Route path="/ayuda" element={<Ayuda />} />
      </Routes>
    </BrowserRouter>
  );
}
