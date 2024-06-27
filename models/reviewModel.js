const pool = require('../database');

async function createReview(data) {
    const { id_usuario, id_producto, rating, comentario } = data;

    // Validaciones de input
    if (!id_usuario || !id_producto || !rating) {
        throw new Error('Usuario, Producto y Rating son obligatorios');
    }

    if (rating < 1 || rating > 5) {
        throw new Error('Rating debe estar entre 1 y 5');
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

    const query = 'INSERT INTO "Reviews" (id_usuario, id_producto, rating, comentario) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [id_usuario, id_producto, rating, comentario];
    const result = await pool.query(query, values);
    return result.rows[0];
}

async function getAllReviews() {
    const query = 'SELECT * FROM "Reviews"';
    const result = await pool.query(query);
    return result.rows;
}

async function getReviewById(id) {
    const query = 'SELECT * FROM "Reviews" WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

async function updateReview(id, data) {
    const { id_usuario, id_producto, rating, comentario } = data;

    // Validaciones de input
    if (!id_usuario || !id_producto || !rating) {
        throw new Error('Usuario, Producto y Rating son obligatorios');
    }

    if (rating < 1 || rating > 5) {
        throw new Error('Rating debe estar entre 1 y 5');
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

    const query = 'UPDATE "Reviews" SET id_usuario = $1, id_producto = $2, rating = $3, comentario = $4 WHERE id = $5 RETURNING *';
    const values = [id_usuario, id_producto, rating, comentario, id];
    const result = await pool.query(query, values);
    return result.rows[0];
}

async function deleteReview(id) {
    const query = 'DELETE FROM "Reviews" WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

module.exports = {
    createReview,
    getAllReviews,
    getReviewById,
    updateReview,
    deleteReview
};
