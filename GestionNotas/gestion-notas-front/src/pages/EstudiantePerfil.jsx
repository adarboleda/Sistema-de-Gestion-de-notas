import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { estudianteService } from '../services/estudianteService';
import AlertNotification from '../components/AlertNotification';
import { useAlert } from '../hooks/useAlert';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function EstudiantePerfil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [estudiante, setEstudiante] = useState(null);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [resumenAcademico, setResumenAcademico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notas');
  const { alert, showSuccess, showError, hideAlert } = useAlert();

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Cargar datos del estudiante
      const estudianteData = await estudianteService.obtenerPorId(id);
      setEstudiante(estudianteData);

      // Cargar evaluaciones del estudiante
      const response = await fetch(
        `http://localhost:3000/api/evaluaciones?estudianteId=${id}`
      );
      const evaluacionesData = await response.json();
      setEvaluaciones(evaluacionesData);

      // Calcular resumen académico
      calcularResumenAcademico(evaluacionesData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      showError('Error al cargar la información del estudiante');
    } finally {
      setLoading(false);
    }
  };

  const calcularResumenAcademico = (evaluacionesData) => {
    // Agrupar por asignatura
    const porAsignatura = {};

    evaluacionesData.forEach((ev) => {
      const asigId = ev.asignaturaId;
      if (!porAsignatura[asigId]) {
        porAsignatura[asigId] = {
          asignatura: ev.Asignatura?.nombre || 'Sin asignatura',
          parciales: { 1: null, 2: null, 3: null },
          totalSobre42: 0,
          estado: 'Pendiente',
        };
      }

      if (ev.parcial >= 1 && ev.parcial <= 3) {
        porAsignatura[asigId].parciales[ev.parcial] = ev.nota_sobre_14;
      }
    });

    // Calcular totales y estados
    Object.keys(porAsignatura).forEach((asigId) => {
      const asig = porAsignatura[asigId];
      const p1 = asig.parciales[1] || 0;
      const p2 = asig.parciales[2] || 0;
      const p3 = asig.parciales[3] || 0;

      asig.totalSobre42 = p1 + p2 + p3;

      // Determinar estado
      if (p1 + p2 < 19.6 && p1 > 0 && p2 > 0) {
        asig.estado = 'Reprobado Anticipado';
        asig.estadoColor = 'danger';
      } else if (asig.totalSobre42 >= 28 && p1 > 0 && p2 > 0 && p3 > 0) {
        asig.estado = 'Aprobado';
        asig.estadoColor = 'success';
      } else if (asig.totalSobre42 < 28 && p1 > 0 && p2 > 0 && p3 > 0) {
        asig.estado = 'Reprobado';
        asig.estadoColor = 'danger';
      } else {
        asig.estado = 'En Curso';
        asig.estadoColor = 'warning';
      }
    });

    setResumenAcademico(porAsignatura);
  };

  const descargarPDF = () => {
    try {
      const doc = new jsPDF();

      // Título
      doc.setFontSize(18);
      doc.text('Reporte Académico del Estudiante', 14, 20);

      // Información del estudiante
      doc.setFontSize(12);
      doc.text(`Nombre: ${estudiante.nombre} ${estudiante.apellido}`, 14, 35);
      doc.text(`Cédula: ${estudiante.cedula}`, 14, 42);
      doc.text(`Email: ${estudiante.email}`, 14, 49);
      doc.text(`Carrera: ${estudiante.carrera}`, 14, 56);
      doc.text(`Estado: ${estudiante.estado}`, 14, 63);

      // Tabla de notas
      if (resumenAcademico && Object.keys(resumenAcademico).length > 0) {
        const tableData = Object.values(resumenAcademico).map((asig) => [
          asig.asignatura,
          asig.parciales[1]?.toFixed(2) || '-',
          asig.parciales[2]?.toFixed(2) || '-',
          asig.parciales[3]?.toFixed(2) || '-',
          asig.totalSobre42.toFixed(2),
          ((asig.totalSobre42 / 42) * 20).toFixed(2),
          asig.estado,
        ]);

        autoTable(doc, {
          startY: 75,
          head: [
            [
              'Asignatura',
              'P1 (/14)',
              'P2 (/14)',
              'P3 (/14)',
              'Total (/42)',
              'Promedio (/20)',
              'Estado',
            ],
          ],
          body: tableData,
          theme: 'striped',
          headStyles: { fillColor: [66, 139, 202] },
        });
      }

      // Fecha de generación
      const y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 100;
      doc.setFontSize(10);
      doc.text(`Generado el: ${new Date().toLocaleDateString('es-EC')}`, 14, y);

      doc.save(`reporte_${estudiante.cedula}_${estudiante.nombre}.pdf`);
      showSuccess('PDF descargado exitosamente');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      showError('Error al generar el PDF');
    }
  };

  const descargarExcel = () => {
    try {
      // Crear datos para Excel
      const datosEstudiante = [
        ['REPORTE ACADÉMICO DEL ESTUDIANTE'],
        [],
        ['Nombre:', `${estudiante.nombre} ${estudiante.apellido}`],
        ['Cédula:', estudiante.cedula],
        ['Email:', estudiante.email],
        ['Carrera:', estudiante.carrera],
        ['Estado:', estudiante.estado],
        [],
        ['NOTAS POR ASIGNATURA'],
        [
          'Asignatura',
          'Parcial 1 (/14)',
          'Parcial 2 (/14)',
          'Parcial 3 (/14)',
          'Total (/42)',
          'Promedio (/20)',
          'Estado',
        ],
      ];

      if (resumenAcademico) {
        Object.values(resumenAcademico).forEach((asig) => {
          datosEstudiante.push([
            asig.asignatura,
            asig.parciales[1]?.toFixed(2) || '-',
            asig.parciales[2]?.toFixed(2) || '-',
            asig.parciales[3]?.toFixed(2) || '-',
            asig.totalSobre42.toFixed(2),
            ((asig.totalSobre42 / 42) * 20).toFixed(2),
            asig.estado,
          ]);
        });
      }

      datosEstudiante.push([]);
      datosEstudiante.push([
        'Generado el:',
        new Date().toLocaleDateString('es-EC'),
      ]);

      // Crear workbook y worksheet
      const ws = XLSX.utils.aoa_to_sheet(datosEstudiante);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Reporte Académico');

      // Descargar
      XLSX.writeFile(
        wb,
        `reporte_${estudiante.cedula}_${estudiante.nombre}.xlsx`
      );
      showSuccess('Excel descargado exitosamente');
    } catch (error) {
      console.error('Error al generar Excel:', error);
      showError('Error al generar el Excel');
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!estudiante) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">Estudiante no encontrado</div>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/estudiantes')}
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <AlertNotification alert={alert} onClose={hideAlert} />

      {/* Header con información del estudiante */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-2 text-center">
                  {estudiante.foto ? (
                    <img
                      src={estudiante.foto}
                      alt={`${estudiante.nombre} ${estudiante.apellido}`}
                      className="rounded-circle img-thumbnail"
                      style={{
                        width: '120px',
                        height: '120px',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          'https://via.placeholder.com/120?text=' +
                          estudiante.nombre.charAt(0) +
                          estudiante.apellido.charAt(0);
                      }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto"
                      style={{
                        width: '120px',
                        height: '120px',
                        fontSize: '2.5rem',
                      }}
                    >
                      {estudiante.nombre.charAt(0)}
                      {estudiante.apellido.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="col-md-7">
                  <h2 className="mb-1">
                    {estudiante.nombre} {estudiante.apellido}
                  </h2>
                  <p className="text-muted mb-2">
                    <strong>Cédula:</strong> {estudiante.cedula} |
                    <strong> Email:</strong> {estudiante.email}
                  </p>
                  <p className="mb-0">
                    <strong>Carrera:</strong> {estudiante.carrera} |
                    <strong> Estado:</strong>{' '}
                    <span
                      className={`badge bg-${
                        estudiante.estado === 'activo' ? 'success' : 'secondary'
                      }`}
                    >
                      {estudiante.estado}
                    </span>
                  </p>
                </div>
                <div className="col-md-3 text-end">
                  <button
                    className="btn btn-danger me-2"
                    onClick={descargarPDF}
                  >
                    <i className="bi bi-file-earmark-pdf"></i> Descargar PDF
                  </button>
                  <button className="btn btn-success" onClick={descargarExcel}>
                    <i className="bi bi-file-earmark-excel"></i> Descargar Excel
                  </button>
                  <br />
                  <button
                    className="btn btn-secondary mt-2"
                    onClick={() => navigate('/estudiantes')}
                  >
                    ← Volver
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'notas' ? 'active' : ''}`}
            onClick={() => setActiveTab('notas')}
          >
            <i className="bi bi-bar-chart-fill"></i> Notas por Asignatura
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === 'evaluaciones' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('evaluaciones')}
          >
            <i className="bi bi-file-text"></i> Evaluaciones Detalladas
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'historial' ? 'active' : ''}`}
            onClick={() => setActiveTab('historial')}
          >
            <i className="bi bi-clock-history"></i> Historial Académico
          </button>
        </li>
      </ul>

      {/* Contenido de las tabs */}
      {activeTab === 'notas' && (
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Resumen Académico por Asignatura</h5>
          </div>
          <div className="card-body">
            {resumenAcademico && Object.keys(resumenAcademico).length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Asignatura</th>
                      <th className="text-center">
                        Parcial 1<br />
                        (14 pts)
                      </th>
                      <th className="text-center">
                        Parcial 2<br />
                        (14 pts)
                      </th>
                      <th className="text-center">
                        Parcial 3<br />
                        (14 pts)
                      </th>
                      <th className="text-center">
                        Total
                        <br />
                        (42 pts)
                      </th>
                      <th className="text-center">
                        Promedio
                        <br />
                        (20 pts)
                      </th>
                      <th className="text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(resumenAcademico).map((asig, idx) => {
                      const promedio = ((asig.totalSobre42 / 42) * 20).toFixed(
                        2
                      );
                      return (
                        <tr key={idx}>
                          <td>
                            <strong>{asig.asignatura}</strong>
                          </td>
                          <td className="text-center">
                            {asig.parciales[1] !== null
                              ? asig.parciales[1].toFixed(2)
                              : '-'}
                          </td>
                          <td className="text-center">
                            {asig.parciales[2] !== null
                              ? asig.parciales[2].toFixed(2)
                              : '-'}
                          </td>
                          <td className="text-center">
                            {asig.parciales[3] !== null
                              ? asig.parciales[3].toFixed(2)
                              : '-'}
                          </td>
                          <td className="text-center">
                            <strong>{asig.totalSobre42.toFixed(2)}</strong>
                          </td>
                          <td className="text-center">
                            <strong>{promedio}</strong>
                          </td>
                          <td className="text-center">
                            <span className={`badge bg-${asig.estadoColor}`}>
                              {asig.estado}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted text-center py-5">
                No hay evaluaciones registradas para este estudiante
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'evaluaciones' && (
        <div className="card">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">Evaluaciones Detalladas</h5>
          </div>
          <div className="card-body">
            {evaluaciones.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-sm table-striped">
                  <thead className="table-light">
                    <tr>
                      <th>Asignatura</th>
                      <th>Parcial</th>
                      <th>Tarea</th>
                      <th>Informe</th>
                      <th>Lección</th>
                      <th>Examen</th>
                      <th>Nota /20</th>
                      <th>Nota /14</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluaciones.map((ev) => (
                      <tr key={ev.id}>
                        <td>{ev.Asignatura?.nombre || '-'}</td>
                        <td className="text-center">
                          <span className="badge bg-info">P{ev.parcial}</span>
                        </td>
                        <td>{ev.tarea.toFixed(2)}</td>
                        <td>{ev.informe.toFixed(2)}</td>
                        <td>{ev.leccion.toFixed(2)}</td>
                        <td>{ev.examen.toFixed(2)}</td>
                        <td>
                          <strong>{ev.nota_parcial.toFixed(2)}</strong>
                        </td>
                        <td>
                          <strong>{ev.nota_sobre_14.toFixed(2)}</strong>
                        </td>
                        <td>
                          <small>
                            {new Date(ev.fecha_evaluacion).toLocaleDateString()}
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted text-center py-5">
                No hay evaluaciones registradas
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'historial' && (
        <div className="card">
          <div className="card-header bg-info text-white">
            <h5 className="mb-0">Historial Académico Completo</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <h6>Información Personal</h6>
                <ul className="list-group mb-3">
                  <li className="list-group-item">
                    <strong>Cédula:</strong> {estudiante.cedula}
                  </li>
                  <li className="list-group-item">
                    <strong>Nombre:</strong> {estudiante.nombre}{' '}
                    {estudiante.apellido}
                  </li>
                  <li className="list-group-item">
                    <strong>Email:</strong> {estudiante.email}
                  </li>
                  <li className="list-group-item">
                    <strong>Teléfono:</strong>{' '}
                    {estudiante.telefono || 'No registrado'}
                  </li>
                  <li className="list-group-item">
                    <strong>Dirección:</strong>{' '}
                    {estudiante.direccion || 'No registrada'}
                  </li>
                </ul>
              </div>
              <div className="col-md-6">
                <h6>Información Académica</h6>
                <ul className="list-group mb-3">
                  <li className="list-group-item">
                    <strong>Carrera:</strong> {estudiante.carrera}
                  </li>
                  <li className="list-group-item">
                    <strong>Estado:</strong> {estudiante.estado}
                  </li>
                  <li className="list-group-item">
                    <strong>Total Evaluaciones:</strong> {evaluaciones.length}
                  </li>
                  <li className="list-group-item">
                    <strong>Asignaturas Cursadas:</strong>{' '}
                    {resumenAcademico
                      ? Object.keys(resumenAcademico).length
                      : 0}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
