const pool = require('../database');
const { hashPassword, comparePasswords } = require('./passwordUtils'); 
const bcrypt = require('bcrypt');

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

async function findUserById(id) {
    const query = 'SELECT * FROM "Usuarios" WHERE id = $1';
    const values = [id];

    try {
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return null;
        } else {
            return result.rows[0];
        }
    } catch (err) {
        console.error('Error al encontrar usuario por ID:', err);
        throw err;
    }
}

async function createUser(nombre, email, password, role) {
    const hashedPassword = await hashPassword(password);
    const query = 'INSERT INTO "Usuarios" (nombre, email, password, role, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id';
    const values = [nombre, email, hashedPassword, role];

    try {
        const result = await pool.query(query, values);
        const userId = result.rows[0].id;
        return { id: userId, nombre, email, role, created_at: new Date() };
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
}

async function authenticateUser(email, password) {
    const query = 'SELECT * FROM "Usuarios" WHERE email = $1';
    const values = [email];

    try {
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return null;
        }

        const user = result.rows[0];
        console.log('Usuario encontrado:', user); // Añadir este log para verificar el usuario encontrado
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Resultado de la comparación:', isPasswordValid); // Añadir este log para verificar el resultado de la comparación

        if (isPasswordValid) {
            return user;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error al autenticar el usuario:', error);
        throw new Error('Error en la autenticación');
    }
}

module.exports = { findByEmail, createUser, findUserById, authenticateUser };
