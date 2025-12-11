import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Estudiante = sequelize.define(
  'Estudiante',
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
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING(60),
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
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    foto: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
      defaultValue: null,
      comment: 'URL o base64 de la foto del estudiante',
    },
    carrera: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    curso: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    paralelo: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM('activo', 'inactivo', 'graduado', 'retirado'),
      allowNull: false,
      defaultValue: 'activo',
    },
    fecha_matricula: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    eliminado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Soft delete - true si está eliminado',
    },
  },
  {
    tableName: 'estudiantes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
