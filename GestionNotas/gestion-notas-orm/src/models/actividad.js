import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Estudiante } from './estudiante.js';
import { Usuario } from './usuario.js';

export const Actividad = sequelize.define(
  'Actividad',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipo: {
      type: DataTypes.ENUM(
        'registro',
        'actualizacion',
        'eliminacion',
        'login',
        'logout',
        'evaluacion'
      ),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Usuario,
        key: 'id',
      },
    },
    entidad_tipo: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Tipo de entidad afectada: estudiante, docente, nota, etc.',
    },
    entidad_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID de la entidad afectada',
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'actividades',
    timestamps: false,
  }
);

// Relaciones
Usuario.hasMany(Actividad, { foreignKey: 'usuario_id' });
Actividad.belongsTo(Usuario, { foreignKey: 'usuario_id' });
