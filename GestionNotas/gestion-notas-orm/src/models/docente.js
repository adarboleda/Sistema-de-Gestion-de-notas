import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Docente = sequelize.define(
  'Docente',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cedula: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    telefono: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    direccion: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    especialidad: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    titulo_academico: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    area: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    carga_horaria: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    estado: {
      type: DataTypes.ENUM('activo', 'inactivo', 'licencia'),
      allowNull: false,
      defaultValue: 'activo',
    },
    fecha_contratacion: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: 'docentes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
