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
        const { email, password } = user;
        const query = 'INSERT INTO Usuarios (nombre, role, created_at) VALUES (?, ?, NOW())';
        const result = await db.query(query, [null, 'cliente']); // Establece el nombre como null o deja fuera de la inserción

        const newUserId = result.insertId;

        // Retorna el nuevo usuario con el ID asignado
        return { id: newUserId, email, role: 'cliente' }; // Retorna el rol del usuario como "cliente"
    } catch (error) {
        throw error;
    }
}


module.exports = { findByEmail, createUser };
