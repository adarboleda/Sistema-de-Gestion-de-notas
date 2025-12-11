const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database.config');
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define(
  'Usuario',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
      comment: 'Username único (opcional, se puede usar email)',
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM('admin', 'docente', 'estudiante'),
      allowNull: false,
      defaultValue: 'estudiante',
    },
    nombre_completo: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    estudiante_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Referencia al ID de estudiante si rol es estudiante',
    },
    docente_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Referencia al ID de docente si rol es docente',
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
  },
  {
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (usuario) => {
        console.log('🔍 HOOK beforeCreate ejecutándose:');
        console.log('   Email:', usuario.email);
        console.log('   Password original:', usuario.password);
        console.log('   Password type:', typeof usuario.password);
        console.log('   Password length:', usuario.password?.length);

        // Generar username desde email si no existe
        if (!usuario.username && usuario.email) {
          usuario.username = usuario.email.split('@')[0];
          // Si ya existe, agregar timestamp
          const existente = await Usuario.findOne({
            where: { username: usuario.username },
          });
          if (existente) {
            usuario.username = `${usuario.username}_${Date.now()}`;
          }
        }

        // Encriptar contraseña
        if (usuario.password) {
          const passwordOriginal = usuario.password;
          usuario.password = await bcrypt.hash(usuario.password, 10);
          console.log('   Password antes de hash:', passwordOriginal);
          console.log(
            '   Password después de hash:',
            usuario.password.substring(0, 30) + '...'
          );
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed('password')) {
          console.log('🔍 HOOK beforeUpdate - Password cambiado');
          console.log('   Password nuevo:', usuario.password);
          usuario.password = await bcrypt.hash(usuario.password, 10);
          console.log(
            '   Password hasheado:',
            usuario.password.substring(0, 30) + '...'
          );
        }
      },
    },
  }
);

// Método para verificar contraseña
Usuario.prototype.verificarPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Método para obtener usuario sin password
Usuario.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = Usuario;
