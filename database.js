const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'will',
  password: 'Will88',
  database: 'pruebasunitariasapiduoc',
  ssl: false
});

// Manejar la conexión a la base de datos
pool.on('connect', () => {
  console.log('Conexión exitosa a la base de datos PostgreSQL');
});

pool.on('error', (error) => {
  console.error('Error en la conexión a la base de datos PostgreSQL:', error);
});

module.exports = pool;
