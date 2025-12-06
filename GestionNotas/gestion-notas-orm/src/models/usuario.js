import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Usuario = sequelize.define(
  'Usuario',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
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
    rol: {
      type: DataTypes.ENUM('admin', 'docente', 'estudiante'),
      allowNull: false,
      defaultValue: 'estudiante',
    },
    nombre_completo: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    ultimo_acceso: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Relación con estudiante o docente
    estudiante_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    docente_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);
