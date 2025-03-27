require('dotenv').config();

const mysql = require('mysql2');

// Configuración de la conexión
const dbConfig = {
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'db_agenda',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Función para probar la conexión con reintentos
function testConnection(retries = 5, delay = 5000, attempt = 1) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error(`❌ Intento ${attempt} de ${retries}: Error al conectar - ${err.message}`);
      
      if (attempt < retries) {
        console.log(`⌛ Reintentando en ${delay/1000} segundos...`);
        return setTimeout(() => testConnection(retries, delay, attempt + 1), delay);
      }
      
      console.error('🚨 No se pudo conectar después de varios intentos');
      return process.exit(1);
    }
    
    console.log('✅ Conexión a MySQL establecida correctamente');
    connection.release();
  });
}

// Probar la conexión al iniciar
testConnection();

// Manejar errores de conexión perdida
pool.on('error', (err) => {
  console.error('Error en el pool de MySQL:', err.message);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Reconectando a la base de datos...');
    testConnection(3, 2000); // Reintentos más rápidos para reconexión
  }
});

// Exportar funciones de consulta
module.exports = {
  query: (sql, params, callback) => {
    pool.query(sql, params, (err, results) => {
      if (err) {
        console.error('Error en consulta SQL:', err.message);
        return callback(err, null);
      }
      callback(null, results);
    });
  },
  
  getConnection: (callback) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error al obtener conexión:', err.message);
        return callback(err, null);
      }
      callback(null, connection);
    });
  }
};