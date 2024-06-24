const pool = require('../database');
const { hashPassword, comparePasswords } = require('../utils/passwordUtils');

async function findByEmail(email) {
    const query = 'SELECT * FROM "Usuarios" WHERE email = $1';
    const values = [email];

    try {
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return null;
        } else {
            return result.rows[0];
        }
    } catch (err) {
        console.error('Error al encontrar usuario por email:', err);
        throw err;
    }
}

async function createUser(nombre, email, hashedPassword, role) {
    const query = 'INSERT INTO "Usuarios" (nombre, email, password, role, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id';
    const values = [nombre, email, hashedPassword, role];

    try {
        const result = await pool.query(query, values);
        const userId = result.rows[0].id;
        console.log('Usuario creado con ID:', userId);
        return { id: userId, nombre, email, role, created_at: new Date() };
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
}

async function authenticateUser(email, password) {
    const user = await findByEmail(email);
    if (!user) {
        return null;
    }
    const isPasswordValid = await comparePasswords(password, user.password);
    return isPasswordValid ? user : null;
}

module.exports = { findByEmail, createUser, authenticateUser };
