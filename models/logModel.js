const pool = require('../database');

// Crear un nuevo log
async function createLog(tipo, descripcion) {
    const query = `
        INSERT INTO "Logs" (tipo, descripcion)
        VALUES ($1, $2)
        RETURNING *;
    `;
    const values = [tipo, descripcion];
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error guardando el log:', error);
        throw error;
    }
}

// Obtener todos los logs
async function getAllLogs() {
    const query = 'SELECT * FROM "Logs"';
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching logs:', error);
        throw error;
    }
}

// Obtener log por ID
async function getLogById(id) {
    const query = 'SELECT * FROM "Logs" WHERE id = $1';
    const values = [id];
    try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            throw new Error('Log no encontrado');
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error obteniendo el log por ID:', error);
        throw error;
    }
}

module.exports = {
    createLog,
    getAllLogs,
    getLogById
};
