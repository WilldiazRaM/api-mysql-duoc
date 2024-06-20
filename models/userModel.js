const pool = require('../database');
const { comparePasswords } = require('../utils/passwordUtils');

async function findUserByEmail(email) {
    const query = 'SELECT * FROM "Usuarios" WHERE email = $1';
    const values = [email];
    
    console.log('Consulta SQL:', query);
    console.log('Valores:', values);

    try {
        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            return result.rows[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error al encontrar usuario por email:', error.message);
        throw error;
    }
}

async function createUser(nombre, email, hashedPassword, role) {
    const query = 'INSERT INTO "Usuarios" (nombre, email, password, role) VALUES ($1, $2, $3, $4)';
    const values = [nombre, email, hashedPassword, role];
    
    try {
        await pool.query(query, values);
        console.log('Usuario creado exitosamente.');
    } catch (error) {
        console.error('Error al crear usuario:', error.message);
        throw error;
    }
}

async function authenticateUser(email, password) {
    const user = await findUserByEmail(email);
    if (!user) {
        return null;
    }
    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
        return null;
    }
    return user;
}

module.exports = {
    findUserByEmail,
    createUser,
    authenticateUser
};
