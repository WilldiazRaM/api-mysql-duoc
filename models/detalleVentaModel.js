const pool = require('../database');

async function createDetalleVenta(id_venta, id_producto, id_usuario, cantidad, precio_unitario) {
    const query = 'INSERT INTO "DetalleVenta" (id_venta, id_producto, id_usuario, cantidad, precio_unitario) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [id_venta, id_producto, id_usuario, cantidad, precio_unitario];
    
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error en createDetalleVenta:", error);
        throw error;
    }
}

async function obtenerDetallesVenta() {
    const query = 'SELECT * FROM "DetalleVenta"';
    
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error("Error al obtener detalles de venta:", error);
        throw error;
    }
}

async function obtenerDetalleVentaPorId(id) {
    const query = 'SELECT * FROM "DetalleVenta" WHERE id = $1';
    const values = [id];
    
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error al obtener detalle de venta por ID:", error);
        throw error;
    }
}

async function actualizarDetalleVenta(id, id_venta, id_producto, id_usuario, cantidad, precio_unitario) {
    const query = 'UPDATE "DetalleVenta" SET id_venta = $1, id_producto = $2, id_usuario = $3, cantidad = $4, precio_unitario = $5 WHERE id = $6 RETURNING *';
    const values = [id_venta, id_producto, id_usuario, cantidad, precio_unitario, id];
    
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error al actualizar detalle de venta:", error);
        throw error;
    }
}

async function eliminarDetalleVenta(id) {
    const query = 'DELETE FROM "DetalleVenta" WHERE id = $1';
    const values = [id];
    
    try {
        await pool.query(query, values);
    } catch (error) {
        console.error("Error al eliminar detalle de venta:", error);
        throw error;
    }
}

module.exports = {
    createDetalleVenta,
    obtenerDetallesVenta,
    obtenerDetalleVentaPorId,
    actualizarDetalleVenta,
    eliminarDetalleVenta
};
