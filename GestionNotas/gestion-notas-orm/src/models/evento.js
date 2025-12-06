import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Evento = sequelize.define(
  'Evento',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tipo: {
      type: DataTypes.ENUM('examen', 'tarea', 'entrega', 'reunion', 'festivo', 'otro'),
      allowNull: false,
      defaultValue: 'otro',
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    asignatura_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Relacionado con una asignatura específica',
    },
    curso: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: 'primary',
      comment: 'Color para el calendario (Bootstrap classes)',
    },
  },
  {
    tableName: 'eventos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
