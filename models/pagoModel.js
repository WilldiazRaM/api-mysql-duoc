const pool = require('../database');

// Obtener todos los pagos
async function getAllPagos() {
    try {
        const result = await pool.query('SELECT * FROM "Ventas"');
        return result.rows;
    } catch (error) {
        console.error("Error al obtener los pagos:", error);
        throw error;
    }
}

// Obtener un pago por su ID
async function getPagoById(id) {
    try {
        const result = await pool.query('SELECT * FROM "Ventas" WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            throw new Error("Pago no encontrado");
        }
        return result.rows[0];
    } catch (error) {
        console.error("Error al obtener el pago:", error);
        throw error;
    }
}

module.exports = {
    getAllPagos,
    getPagoById
};
