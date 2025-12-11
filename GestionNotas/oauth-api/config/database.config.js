const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración de la base de datos
const dbConfig = {
  database: process.env.DB_NAME || 'gestion_notas',
  username: process.env.DB_USER || 'root',
  password:
    process.env.DB_PASSWORD === undefined ? '' : process.env.DB_PASSWORD,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  dialect: 'mysql',
  logging: false,
  timezone: '-05:00',
  define: {
    timestamps: true,
    underscored: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

console.log(
  `🔌 Intentando conectar a MySQL: ${dbConfig.username}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`
);

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

// Probar conexión
sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Conexión a la base de datos establecida correctamente.');
  })
  .catch((err) => {
    console.error('❌ Error al conectar con la base de datos:', err.message);
    console.error('💡 Verifica:');
    console.error('   1. Que MySQL esté ejecutándose');
    console.error('   2. Que las credenciales en .env sean correctas');
    console.error('   3. Que la base de datos "gestion_notas" exista');
  });

module.exports = { sequelize };
