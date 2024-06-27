const pool = require('../database');

// Crear un nuevo pedido
async function createPedido(id_venta, metodo_entrega, direccion_id, estado) {
    const query = `
        INSERT INTO "Pedidos" (id_venta, metodo_entrega, direccion_id, estado)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [id_venta, metodo_entrega, direccion_id, estado];
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating pedido:', error);
        throw error;
    }
}

// Obtener todos los pedidos
async function getAllPedidos() {
    const query = 'SELECT * FROM "Pedidos"';
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching pedidos:', error);
        throw error;
    }
}

// Obtener pedido por ID
async function getPedidoById(id) {
    const query = 'SELECT * FROM "Pedidos" WHERE id = $1';
    const values = [id];
    try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            throw new Error('Pedido no encontrado');
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching pedido by ID:', error);
        throw error;
    }
}

// Actualizar un pedido
async function updatePedido(id, id_venta, metodo_entrega, direccion_id, estado) {
    const query = `
        UPDATE "Pedidos"
        SET id_venta = $1, metodo_entrega = $2, direccion_id = $3, estado = $4
        WHERE id = $5
        RETURNING *;
    `;
    const values = [id_venta, metodo_entrega, direccion_id, estado, id];
    try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            throw new Error('Pedido no encontrado');
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error updating pedido:', error);
        throw error;
    }
}

// Eliminar un pedido
async function deletePedido(id) {
    const query = 'DELETE FROM "Pedidos" WHERE id = $1 RETURNING *';
    const values = [id];
    try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            throw new Error('Pedido no encontrado');
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting pedido:', error);
        throw error;
    }
}

module.exports = {
    createPedido,
    getAllPedidos,
    getPedidoById,
    updatePedido,
    deletePedido
};
