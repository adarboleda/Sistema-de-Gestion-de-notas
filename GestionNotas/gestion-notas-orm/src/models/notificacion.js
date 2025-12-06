import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Notificacion = sequelize.define(
  'Notificacion',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('info', 'alerta', 'exito', 'error'),
      allowNull: false,
      defaultValue: 'info',
    },
    destinatario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID del usuario destinatario (null = todos)',
    },
    leida: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'notificaciones',
    timestamps: false,
  }
);
