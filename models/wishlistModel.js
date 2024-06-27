const pool = require('../database');

async function createWishlist(data) {
    const { id_usuario, id_producto } = data;

    // Validaciones de input
    if (!id_usuario || !id_producto) {
        throw new Error('Usuario y Producto son obligatorios');
    }

    // Verificar si el usuario existe
    const userCheckQuery = 'SELECT * FROM "Usuarios" WHERE id = $1';
    const userCheckResult = await pool.query(userCheckQuery, [id_usuario]);
    if (userCheckResult.rowCount === 0) {
        throw new Error('El usuario no existe');
    }

    // Verificar si el producto existe
    const productCheckQuery = 'SELECT * FROM "Productos" WHERE id = $1';
    const productCheckResult = await pool.query(productCheckQuery, [id_producto]);
    if (productCheckResult.rowCount === 0) {
        throw new Error('El producto no existe');
    }

    const query = 'INSERT INTO "Wishlists" (id_usuario, id_producto) VALUES ($1, $2) RETURNING *';
    const values = [id_usuario, id_producto];
    const result = await pool.query(query, values);
    return result.rows[0];
}

async function getAllWishlists() {
    const query = 'SELECT * FROM "Wishlists"';
    const result = await pool.query(query);
    return result.rows;
}

async function getWishlistById(id) {
    const query = 'SELECT * FROM "Wishlists" WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

async function updateWishlist(id, data) {
    const { id_usuario, id_producto } = data;

    // Validaciones de input
    if (!id_usuario || !id_producto) {
        throw new Error('Usuario y Producto son obligatorios');
    }

    // Verificar si el usuario existe
    const userCheckQuery = 'SELECT * FROM "Usuarios" WHERE id = $1';
    const userCheckResult = await pool.query(userCheckQuery, [id_usuario]);
    if (userCheckResult.rowCount === 0) {
        throw new Error('El usuario no existe');
    }

    // Verificar si el producto existe
    const productCheckQuery = 'SELECT * FROM "Productos" WHERE id = $1';
    const productCheckResult = await pool.query(productCheckQuery, [id_producto]);
    if (productCheckResult.rowCount === 0) {
        throw new Error('El producto no existe');
    }

    const query = 'UPDATE "Wishlists" SET id_usuario = $1, id_producto = $2 WHERE id = $3 RETURNING *';
    const values = [id_usuario, id_producto, id];
    const result = await pool.query(query, values);
    return result.rows[0];
}

async function deleteWishlist(id) {
    const query = 'DELETE FROM "Wishlists" WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

module.exports = {
    createWishlist,
    getAllWishlists,
    getWishlistById,
    updateWishlist,
    deleteWishlist
};
