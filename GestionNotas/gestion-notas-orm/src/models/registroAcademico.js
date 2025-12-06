import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Estudiante } from './estudiante.js';
import { Asignatura } from './asignatura.js';

export const RegistroAcademico = sequelize.define(
  'RegistroAcademico',
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
    periodo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: 'Ej: 2024-1, 2024-2',
    },
    // Notas de los 3 parciales (sobre 14 cada uno)
    parcial_1: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 14,
      },
    },
    parcial_2: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 14,
      },
    },
    parcial_3: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 14,
      },
    },
    // Suma de parciales (máximo 42 puntos)
    suma_parciales: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 42,
      },
      comment: 'Suma de los 3 parciales (máx 42 puntos)',
    },
    // Promedio final del semestre
    promedio_final: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 20,
      },
      comment: 'Promedio convertido sobre 20 puntos',
    },
    // Estados del semestre
    reprobado_anticipado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'True si P1 + P2 < 28 puntos',
    },
    estado_semestre: {
      type: DataTypes.ENUM('en_curso', 'aprobado', 'reprobado', 'reprobado_anticipado'),
      allowNull: false,
      defaultValue: 'en_curso',
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'registro_academico',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['estudianteId', 'asignaturaId', 'periodo'],
        name: 'unique_estudiante_asignatura_periodo',
      },
    ],
  }
);

// Relaciones
Estudiante.hasMany(RegistroAcademico, { foreignKey: 'estudianteId', onDelete: 'CASCADE' });
RegistroAcademico.belongsTo(Estudiante, { foreignKey: 'estudianteId' });

Asignatura.hasMany(RegistroAcademico, { foreignKey: 'asignaturaId', onDelete: 'CASCADE' });
RegistroAcademico.belongsTo(Asignatura, { foreignKey: 'asignaturaId' });
