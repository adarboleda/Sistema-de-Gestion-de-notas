import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Estudiante } from './estudiante.js';
import { Asignatura } from './asignatura.js';
import { Docente } from './docente.js';

export const Evaluacion = sequelize.define(
  'Evaluacion',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    estudianteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Estudiante,
        key: 'id',
      },
    },
    asignaturaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Asignatura,
        key: 'id',
      },
    },
    docenteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Docente,
        key: 'id',
      },
    },
    parcial: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 3,
      },
      comment: 'Parcial 1, 2 o 3',
    },
    // Componentes del parcial (cada uno sobre 20 puntos)
    tarea: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 20,
      },
      comment: 'Tarea sobre 20 puntos (20% del parcial)',
    },
    informe: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 20,
      },
      comment: 'Informe sobre 20 puntos (20% del parcial)',
    },
    leccion: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 20,
      },
      comment: 'Lección sobre 20 puntos (20% del parcial)',
    },
    examen: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 20,
      },
      comment: 'Examen sobre 20 puntos (40% del parcial)',
    },
    // Nota final del parcial (calculada automáticamente)
    nota_parcial: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 20,
      },
      comment: 'Nota final del parcial (máximo 20 puntos)',
    },
    // Nota sobre 14 puntos (conversión para el sistema)
    nota_sobre_14: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 14,
      },
      comment: 'Nota convertida sobre 14 puntos',
    },
    tipo_evaluacion: {
      type: DataTypes.ENUM('examen', 'tarea', 'proyecto', 'participacion', 'parcial'),
      allowNull: false,
      defaultValue: 'parcial',
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fecha_evaluacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    estado: {
      type: DataTypes.ENUM('aprobado', 'reprobado', 'pendiente'),
      allowNull: false,
      defaultValue: 'pendiente',
      comment: 'Estado del parcial',
    },
    modificado_por: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID del usuario que modificó (para auditoría)',
    },
    eliminado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Eliminación lógica',
    },
  },
  {
    tableName: 'evaluaciones',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['estudianteId', 'asignaturaId', 'parcial'],
        name: 'unique_estudiante_asignatura_parcial',
      },
    ],
  }
);

// Relaciones
Estudiante.hasMany(Evaluacion, { foreignKey: 'estudianteId', onDelete: 'CASCADE' });
Evaluacion.belongsTo(Estudiante, { foreignKey: 'estudianteId' });

Asignatura.hasMany(Evaluacion, { foreignKey: 'asignaturaId', onDelete: 'CASCADE' });
Evaluacion.belongsTo(Asignatura, { foreignKey: 'asignaturaId' });

Docente.hasMany(Evaluacion, { foreignKey: 'docenteId', onDelete: 'CASCADE' });
Evaluacion.belongsTo(Docente, { foreignKey: 'docenteId' });
