const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  ssl: {
    rejectUnauthorized: false 
  }
});

// Manejar la conexión a la base de datos
pool.on('connect', () => {
  console.log('Conexión exitosa a la base de datos PostgreSQL');
});

pool.on('error', (error) => {
  console.error('Error en la conexión a la base de datos PostgreSQL:', error);
});

module.exports = pool;
