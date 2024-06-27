const pool = require('../database');

async function createVenta(id_usuario, monto) {
    const query = 'INSERT INTO "Ventas" (id_usuario, monto) VALUES ($1, $2) RETURNING *';
    const values = [id_usuario, monto];
    
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error en createVenta:", error);
        throw error;
    }
}

async function obtenerVentas() {
    const query = 'SELECT * FROM "Ventas"';
    
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error("Error al obtener ventas:", error);
        throw error;
    }
}

async function obtenerVentaPorId(id) {
    const query = 'SELECT * FROM "Ventas" WHERE id = $1';
    const values = [id];
    
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error al obtener venta por ID:", error);
        throw error;
    }
}

async function actualizarVenta(id, id_usuario, monto) {
    const query = 'UPDATE "Ventas" SET id_usuario = $1, monto = $2 WHERE id = $3 RETURNING *';
    const values = [id_usuario, monto, id];
    
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error al actualizar venta:", error);
        throw error;
    }
}

async function eliminarVenta(id) {
    const query = 'DELETE FROM "Ventas" WHERE id = $1';
    const values = [id];
    
    try {
        await pool.query(query, values);
    } catch (error) {
        console.error("Error al eliminar venta:", error);
        throw error;
    }
}

module.exports = {
    createVenta,
    obtenerVentas,
    obtenerVentaPorId,
    actualizarVenta,
    eliminarVenta
};
