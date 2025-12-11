/**
 * Script para crear usuario administrador
 * Uso: node scripts/crear-admin.js
 */

const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const path = require('path');

// Cargar .env desde la raíz del proyecto oauth-api
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Configuración del administrador
const ADMIN_CONFIG = {
  email: 'admin@gestion.com',
  password: '12345', // CAMBIA ESTA CONTRASEÑA AQUÍ
  rol: 'admin',
};

async function crearAdmin() {
  let connection;

  try {
    console.log('🔧 Iniciando creación de usuario administrador...\n');

    // Debug: Mostrar configuración leída
    console.log('📋 Configuración detectada:');
    console.log('   Host:', process.env.DB_HOST || 'localhost');
    console.log('   Port:', process.env.DB_PORT || '3306');
    console.log('   User:', process.env.DB_USER || 'root');
    console.log('   Password:', process.env.DB_PASSWORD ? '***' : '(vacío)');
    console.log('   Database:', process.env.DB_NAME || 'gestion_notas');
    console.log('');

    // Conectar a la base de datos
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'gestion_notas',
    });

    console.log('✅ Conectado a la base de datos');

    // Verificar si la tabla usuarios existe
    const [tables] = await connection.query("SHOW TABLES LIKE 'usuarios'");

    if (tables.length === 0) {
      console.log('⚠️  La tabla usuarios no existe. Creándola...');

      await connection.query(`
        CREATE TABLE usuarios (
          id INT PRIMARY KEY AUTO_INCREMENT,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          rol ENUM('admin', 'docente', 'estudiante') NOT NULL,
          estudiante_id INT NULL,
          docente_id INT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE,
          FOREIGN KEY (docente_id) REFERENCES docentes(id) ON DELETE CASCADE,
          INDEX idx_email (email),
          INDEX idx_rol (rol),
          INDEX idx_estudiante (estudiante_id),
          INDEX idx_docente (docente_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      console.log('✅ Tabla usuarios creada');
    }

    // Generar hash de la contraseña
    console.log('\n🔐 Generando hash de la contraseña...');
    const passwordHash = await bcrypt.hash(ADMIN_CONFIG.password, 10);
    console.log('✅ Hash generado correctamente');

    // Verificar si ya existe un admin
    const [existingAdmin] = await connection.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [ADMIN_CONFIG.email]
    );

    if (existingAdmin.length > 0) {
      console.log(
        '\n⚠️  Ya existe un usuario con el email:',
        ADMIN_CONFIG.email
      );
      console.log('🔄 Actualizando contraseña...');

      await connection.query(
        'UPDATE usuarios SET password = ?, rol = ? WHERE email = ?',
        [passwordHash, ADMIN_CONFIG.rol, ADMIN_CONFIG.email]
      );

      console.log('✅ Contraseña actualizada correctamente');
    } else {
      console.log('\n➕ Creando nuevo usuario administrador...');

      await connection.query(
        'INSERT INTO usuarios (email, password, rol, estudiante_id, docente_id) VALUES (?, ?, ?, NULL, NULL)',
        [ADMIN_CONFIG.email, passwordHash, ADMIN_CONFIG.rol]
      );

      console.log('✅ Usuario administrador creado correctamente');
    }

    // Mostrar información del admin
    const [admin] = await connection.query(
      'SELECT id, email, rol FROM usuarios WHERE email = ?',
      [ADMIN_CONFIG.email]
    );

    console.log('\n📋 Información del Administrador:');
    console.log('================================');
    console.log('ID:', admin[0].id);
    console.log('Email:', admin[0].email);
    console.log('Rol:', admin[0].rol);
    console.log('================================');

    console.log('\n🎉 ¡Proceso completado exitosamente!');
    console.log('\n🔑 Credenciales de acceso:');
    console.log('   Email:', ADMIN_CONFIG.email);
    console.log('   Contraseña:', ADMIN_CONFIG.password);
    console.log(
      '\n⚠️  IMPORTANTE: Cambia la contraseña después del primer login'
    );
  } catch (error) {
    console.error('\n❌ Error:', error.message);

    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Verifica que MySQL esté corriendo');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error(
        '\n💡 Verifica las credenciales de MySQL en el archivo .env'
      );
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(
        '\n💡 La base de datos "gestion_notas" no existe. Créala primero:'
      );
      console.error('   CREATE DATABASE gestion_notas;');
    }

    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexión cerrada');
    }
  }
}

// Ejecutar
crearAdmin();
