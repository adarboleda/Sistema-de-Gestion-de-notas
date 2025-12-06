# Documentación de Tablas del Backend

## Tablas Implementadas y su Propósito

### 📚 Tablas Principales (En Uso Activo)

#### 1. **estudiante**

- **Propósito**: Almacena información de los estudiantes matriculados
- **Uso actual**: CRUD completo implementado en módulo Estudiantes
- **Relaciones**:
  - Tiene muchas evaluaciones
  - Tiene muchos registros académicos

#### 2. **docente**

- **Propósito**: Almacena información de los profesores
- **Uso actual**: CRUD completo implementado en módulo Docentes
- **Relaciones**:
  - Tiene muchas asignaturas asignadas
  - Registra evaluaciones

#### 3. **asignatura**

- **Propósito**: Catálogo de materias/cursos ofrecidos
- **Uso actual**: CRUD completo implementado en módulo Asignaturas
- **Relaciones**:
  - Pertenece a un docente
  - Tiene muchas evaluaciones

#### 4. **evaluacion**

- **Propósito**: Registro de las 4 componentes de evaluación (Tarea, Informe, Lección, Examen) por parcial
- **Uso actual**: CRUD completo con cálculo automático de notas sobre 20 y sobre 14
- **Campos importantes**:
  - `tarea` (20%)
  - `informe` (20%)
  - `leccion` (20%)
  - `examen` (40%)
  - `nota_parcial` (calculada sobre 20)
  - `nota_sobre_14` (calculada para parcial)
  - `parcial` (1, 2 o 3)
- **Relaciones**:
  - Pertenece a un estudiante
  - Pertenece a una asignatura
  - Registrada por un docente

#### 5. **registroAcademico**

- **Propósito**: Historial consolidado de notas por semestre
- **Uso actual**: Se actualiza automáticamente al crear/modificar evaluaciones
- **Relaciones**:
  - Pertenece a un estudiante
  - Pertenece a una asignatura

---

### 🔮 Tablas para Funcionalidades Futuras

#### 6. **usuario**

- **Propósito**: Sistema de autenticación y control de acceso
- **Uso futuro**:
  - Login con roles (admin, docente, estudiante)
  - Permisos diferenciados por tipo de usuario
  - Estudiantes solo pueden ver sus notas (read-only)
  - Docentes solo pueden modificar sus asignaturas
  - Administradores tienen acceso completo
- **Estado**: Modelo creado, pendiente de implementación
- **Prioridad**: Alta (importante para seguridad)

#### 7. **notificacion**

- **Propósito**: Sistema de alertas y mensajes dentro de la aplicación
- **Uso futuro**:
  - Notificar a estudiantes cuando se publican notas
  - Alertas de reprobación anticipada
  - Recordatorios de evaluaciones pendientes
  - Avisos de cambios en el sistema
- **Estado**: Modelo creado, pendiente de implementación
- **Prioridad**: Media

#### 8. **evento**

- **Propósito**: Calendario académico con fechas importantes
- **Uso futuro**:
  - Fechas de exámenes
  - Entregas de tareas
  - Días festivos
  - Inicio/fin de parciales y semestre
- **Estado**: Modelo y controlador creados, parcialmente implementado
- **Nota**: Actualmente se consulta en el dashboard pero puede retornar vacío
- **Prioridad**: Media

#### 9. **actividad**

- **Propósito**: Registro de tareas y trabajos programados
- **Uso futuro**:
  - Gestión de tareas asignadas por docentes
  - Seguimiento de entregas
  - Calificación de trabajos
  - Integración con evaluaciones (el componente "Tarea" de evaluación)
- **Estado**: Modelo y controlador creados, pendiente de integración completa
- **Prioridad**: Alta (relacionado con sistema de evaluación)

#### 10. **nota** (tabla legacy)

- **Propósito**: Tabla anterior al sistema actual de evaluaciones
- **Estado**: DEPRECADA - Reemplazada por tabla `evaluacion`
- **Recomendación**:
  - Se mantiene por compatibilidad histórica
  - No usar para nuevos registros
  - Considerar eliminar o migrar datos si es necesario

---

## 🔄 Flujo de Datos Actual

```
Docente registra → EVALUACION (T, I, L, E)
                       ↓
                 Calcula automáticamente
                       ↓
              nota_parcial (/20) y nota_sobre_14 (/14)
                       ↓
                 Actualiza → REGISTRO_ACADEMICO
                       ↓
           Estudiante ve en → PERFIL (P1, P2, P3, Total)
                       ↓
              Verifica estados académicos
```

## 🎯 Estados Académicos Implementados

1. **Aprobado Parcial**: Nota ≥ 9.8/14 en el parcial
2. **Reprobado Parcial**: Nota < 9.8/14 en el parcial
3. **Reprobado Anticipado**: P1 + P2 < 19.6/28 (equivalente a < 28/42)
4. **Aprobado Semestre**: Total ≥ 29.4/42 (equivalente a ≥ 42/60 en escala final)
5. **Reprobado Semestre**: Total < 29.4/42 o reprobación anticipada
6. **En Curso**: Parciales pendientes

## 📋 Recomendaciones de Implementación

### Prioridad Alta

1. **Sistema de Autenticación** (tabla `usuario`)

   - Implementar login con JWT o sesiones
   - Roles y permisos por tipo de usuario
   - Vista diferenciada según rol

2. **Sistema de Actividades** (tabla `actividad`)
   - Integrar con componente "Tarea" de evaluaciones
   - Permitir a docentes asignar trabajos
   - Tracking de entregas

### Prioridad Media

3. **Sistema de Notificaciones** (tabla `notificacion`)

   - Notificar publicación de notas
   - Alertas de reprobación
   - Mensajes del sistema

4. **Calendario Académico** (tabla `evento`)
   - Visualización de fechas importantes
   - Integración con dashboard
   - Recordatorios automáticos

### Consideraciones

- **Tabla `nota`**: Evaluar si migrar datos históricos o eliminar
- **Soft Delete**: Todas las tablas principales ya implementan eliminación lógica (`eliminado` BOOLEAN)
- **Auditoría**: Considerar agregar campos `createdBy`, `updatedBy` para trazabilidad

## 🔧 Mantenimiento

- Todas las tablas activas tienen soft delete implementado
- Controllers filtran registros eliminados (`eliminado: false`)
- Frontend integra sistema de alertas Bootstrap
- Backend usa Sequelize ORM para operaciones de base de datos

---

**Última actualización**: Diciembre 6, 2025
