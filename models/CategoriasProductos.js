const pool = require('../database')

class CategoriasProductos {
    static async getAll() {
        const res = await pool.query('SELECT * FROM "CategoriasProductos"');
        return res.rows;
    }

    static async getById(id) {
        const res = await pool.query('SELECT * FROM "CategoriasProductos" WHERE id = $1', [id]);
        return res.rows[0];
    }

    static async create(nombre) {
        const res = await pool.query('INSERT INTO "CategoriasProductos" (nombre) VALUES ($1) RETURNING *', [nombre]);
        return res.rows[0];
    }

    static async update(id, nombre) {
        const res = await pool.query('UPDATE "CategoriasProductos" SET nombre = $1 WHERE id = $2 RETURNING *', [nombre, id]);
        return res.rows[0];
    }

    static async delete(id) {
        const res = await pool.query('DELETE FROM "CategoriasProductos" WHERE id = $1 RETURNING *', [id]);
        return res.rows[0];
    }
}

module.exports = CategoriasProductos;
