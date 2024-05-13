const db = require('../database');

async function findByEmail(email) {
    try {
        const rows = await db.query('SELECT * FROM Usuarios WHERE email = ?', [email]);
        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    } catch (err) {
        throw err;
    }
}

async function createUser(user) {
    try {
        const { nombre, email, password, role } = user;
        const query = 'INSERT INTO Usuarios (nombre, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())';
        const result = await db.query(query, [nombre, email, password, role]);

        const newUserId = result.insertId;

        // Retorna el nuevo usuario con el ID asignado
        return { id: newUserId, nombre, email, role, created_at: new Date() };
    } catch (error) {
        throw error;
    }
}

module.exports = { findByEmail, createUser };
