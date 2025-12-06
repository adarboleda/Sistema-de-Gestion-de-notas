export default function Ayuda() {
  return (
    <div className="container mt-4">
      <h1 className="mb-4">❓ Ayuda - Sistema de Gestión de Notas</h1>

      {/* Sistema de Evaluación */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">
            <i className="bi bi-book-fill"></i> Sistema de Evaluación por Parciales
          </h4>
        </div>
        <div className="card-body">
          <h5>Estructura del Sistema</h5>
          <ul>
            <li>
              <strong>3 Parciales por Semestre:</strong> Cada parcial tiene un peso de 14 puntos
            </li>
            <li>
              <strong>Puntuación Total:</strong> 42 puntos posibles (14 + 14 + 14)
            </li>
            <li>
              <strong>Aprobación:</strong> Se requiere un mínimo de <strong>42.10 puntos</strong>{' '}
              para aprobar
            </li>
          </ul>

          <h5 className="mt-4">Componentes de Cada Parcial</h5>
          <p>Cada parcial se compone de 4 evaluaciones, cada una calificada sobre 20 puntos:</p>
          <div className="row">
            <div className="col-md-6">
              <ul>
                <li>
                  <strong>Tarea:</strong> 20% del parcial (sobre 20 pts)
                </li>
                <li>
                  <strong>Informe:</strong> 20% del parcial (sobre 20 pts)
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <ul>
                <li>
                  <strong>Lección:</strong> 20% del parcial (sobre 20 pts)
                </li>
                <li>
                  <strong>Examen:</strong> 40% del parcial (sobre 20 pts)
                </li>
              </ul>
            </div>
          </div>

          <div className="alert alert-info mt-3">
            <h6>Ejemplo de Cálculo:</h6>
            <p className="mb-1">Si un estudiante obtiene:</p>
            <ul>
              <li>Tarea: 18/20 → 18 × 0.20 = 3.6 puntos</li>
              <li>Informe: 16/20 → 16 × 0.20 = 3.2 puntos</li>
              <li>Lección: 15/20 → 15 × 0.20 = 3.0 puntos</li>
              <li>Examen: 17/20 → 17 × 0.40 = 6.8 puntos</li>
            </ul>
            <p className="mb-1">
              <strong>Nota del Parcial:</strong> 3.6 + 3.2 + 3.0 + 6.8 = <strong>16.6/20</strong>
            </p>
            <p className="mb-0">
              <strong>Conversión a 14 puntos:</strong> (16.6/20) × 14 = <strong>11.62/14</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Regla de Reprobación Anticipada */}
      <div className="card mb-4">
        <div className="card-header bg-danger text-white">
          <h4 className="mb-0">⚠️ Regla de Reprobación Anticipada</h4>
        </div>
        <div className="card-body">
          <div className="alert alert-danger">
            <h5>Condición Crítica:</h5>
            <p className="mb-0">
              Si la suma de <strong>Parcial 1 + Parcial 2 &lt; 28 puntos</strong>, el estudiante
              queda <strong className="text-decoration-underline">reprobado anticipadamente</strong>{' '}
              y <strong>NO puede rendir el Parcial 3</strong>.
            </p>
          </div>

          <h6>Explicación:</h6>
          <p>
            Como el total de puntos posibles son 42 (14+14+14) y se necesita 42.10 para aprobar, si
            un estudiante obtiene menos de 28 puntos en los primeros dos parciales, es
            matemáticamente imposible alcanzar los 42.10 puntos, incluso obteniendo la nota máxima
            en el Parcial 3.
          </p>

          <div className="alert alert-warning">
            <strong>Ejemplo:</strong>
            <p className="mb-1">
              - Parcial 1: 12/14
              <br />- Parcial 2: 13/14
              <br />- <strong>Suma: 25/28</strong> → Como 25 &lt; 28, el estudiante reprueba
              automáticamente
            </p>
          </div>
        </div>
      </div>

      {/* Gestión de Estudiantes */}
      <div className="card mb-4">
        <div className="card-header bg-success text-white">
          <h4 className="mb-0">👨‍🎓 Gestión de Estudiantes</h4>
        </div>
        <div className="card-body">
          <h5>Campos Requeridos:</h5>
          <ul>
            <li>
              <strong>Cédula:</strong> Identificación única (10 dígitos)
            </li>
            <li>
              <strong>Nombre y Apellido:</strong> Datos personales del estudiante
            </li>
            <li>
              <strong>Email:</strong> Correo electrónico único
            </li>
          </ul>

          <h5 className="mt-3">Campos Opcionales:</h5>
          <ul>
            <li>Teléfono, Dirección, Fecha de Nacimiento</li>
            <li>Carrera, Curso, Paralelo</li>
            <li>
              <strong>Estado:</strong> Activo, Inactivo, Graduado, Retirado
            </li>
          </ul>

          <h5 className="mt-3">Búsqueda Avanzada:</h5>
          <p>Puede buscar estudiantes por:</p>
          <ul>
            <li>Cédula (búsqueda exacta o parcial)</li>
            <li>Nombre o Apellido</li>
            <li>ID del sistema</li>
          </ul>
        </div>
      </div>

      {/* Gestión de Docentes */}
      <div className="card mb-4">
        <div className="card-header bg-info text-white">
          <h4 className="mb-0">👨‍🏫 Gestión de Docentes</h4>
        </div>
        <div className="card-body">
          <h5>Información del Docente:</h5>
          <ul>
            <li>
              <strong>Cédula:</strong> Identificación única
            </li>
            <li>
              <strong>Datos Personales:</strong> Nombre, Apellido, Email, Teléfono, Dirección
            </li>
            <li>
              <strong>Título Académico:</strong> Ingeniero, Licenciado, Magíster, PhD, etc.
            </li>
            <li>
              <strong>Especialidad:</strong> Campo de especialización
            </li>
            <li>
              <strong>Área:</strong> Área de enseñanza (Matemáticas, Ciencias, etc.)
            </li>
            <li>
              <strong>Carga Horaria:</strong> Horas de trabajo por semana
            </li>
            <li>
              <strong>Estado:</strong> Activo, Inactivo, Licencia
            </li>
          </ul>
        </div>
      </div>

      {/* Dashboard */}
      <div className="card mb-4">
        <div className="card-header bg-warning text-dark">
          <h4 className="mb-0">📊 Dashboard</h4>
        </div>
        <div className="card-body">
          <p>El Dashboard muestra información en tiempo real del sistema:</p>
          <ul>
            <li>
              <strong>Actividades Recientes:</strong> Últimas 5 acciones realizadas en el sistema
            </li>
            <li>
              <strong>Notificaciones:</strong> Alertas y mensajes importantes
            </li>
            <li>
              <strong>Calendario:</strong> Próximos eventos en los siguientes 7 días
            </li>
          </ul>
        </div>
      </div>

      {/* Preguntas Frecuentes */}
      <div className="card mb-4">
        <div className="card-header bg-secondary text-white">
          <h4 className="mb-0">❓ Preguntas Frecuentes</h4>
        </div>
        <div className="card-body">
          <div className="accordion" id="faqAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faq1"
                >
                  ¿Cómo se calcula la nota final de un parcial?
                </button>
              </h2>
              <div
                id="faq1"
                className="accordion-collapse collapse show"
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">
                  La nota del parcial se calcula automáticamente al ingresar las 4 notas (Tarea,
                  Informe, Lección, Examen). El sistema aplica los porcentajes correspondientes
                  (20%, 20%, 20%, 40%) y convierte el resultado de 20 puntos a 14 puntos.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faq2"
                >
                  ¿Qué pasa si edito una evaluación ya registrada?
                </button>
              </h2>
              <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Al editar una evaluación, el sistema recalcula automáticamente la nota del parcial
                  y actualiza el registro académico del estudiante. También verifica si se cumple la
                  condición de reprobación anticipada (P1+P2 &lt; 28).
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faq3"
                >
                  ¿Puedo eliminar un estudiante o docente?
                </button>
              </h2>
              <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Sí, puede eliminar registros. Sin embargo, se recomienda cambiar el estado a
                  "Inactivo" en lugar de eliminar para mantener el historial. La eliminación es
                  permanente y no se puede deshacer.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faq4"
                >
                  ¿Cómo funciona la búsqueda por cédula?
                </button>
              </h2>
              <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  La búsqueda acepta búsquedas parciales. Puede ingresar solo los primeros dígitos
                  de la cédula y el sistema mostrará todos los registros que coincidan. También
                  puede buscar por nombre, apellido o ID.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Soporte */}
      <div className="alert alert-light border">
        <h5>📞 Soporte Técnico</h5>
        <p className="mb-0">
          Para asistencia adicional o reportar problemas, por favor contacte al administrador del
          sistema o consulte la documentación técnica en el repositorio del proyecto.
        </p>
      </div>
    </div>
  );
}
