const pool = require('../database');

async function createCoupon(data) {
    const { codigo, descuento, fecha_expiracion, usos_restantes } = data;

    // Validaciones de input
    if (!codigo || !descuento || !fecha_expiracion || !usos_restantes) {
        throw new Error('Todos los campos son obligatorios');
    }

    const query = 'INSERT INTO "Coupons" (codigo, descuento, fecha_expiracion, usos_restantes) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [codigo, descuento, fecha_expiracion, usos_restantes];
    const result = await pool.query(query, values);
    return result.rows[0];
}

async function getAllCoupons() {
    const query = 'SELECT * FROM "Coupons"';
    const result = await pool.query(query);
    return result.rows;
}

async function getCouponById(id) {
    const query = 'SELECT * FROM "Coupons" WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

async function updateCoupon(id, data) {
    const { codigo, descuento, fecha_expiracion, usos_restantes } = data;

    // Validaciones de input
    if (!codigo || !descuento || !fecha_expiracion || !usos_restantes) {
        throw new Error('Todos los campos son obligatorios');
    }

    const query = 'UPDATE "Coupons" SET codigo = $1, descuento = $2, fecha_expiracion = $3, usos_restantes = $4 WHERE id = $5 RETURNING *';
    const values = [codigo, descuento, fecha_expiracion, usos_restantes, id];
    const result = await pool.query(query, values);
    return result.rows[0];
}

async function deleteCoupon(id) {
    const query = 'DELETE FROM "Coupons" WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

module.exports = {
    createCoupon,
    getAllCoupons,
    getCouponById,
    updateCoupon,
    deleteCoupon
};
