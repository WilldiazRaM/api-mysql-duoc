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

async function updateUser(id, nombre, email, role) {
    const query = 'UPDATE "Usuarios" SET nombre = $1, email = $2, role = $3 WHERE id = $4';
    const values = [nombre, email, role, id];
    
    try {
        await pool.query(query, values);
        console.log('Usuario actualizado exitosamente.');
    } catch (error) {
        console.error('Error al actualizar usuario:', error.message);
        throw error;
    }
}

async function deleteUser(id) {
    const query = 'DELETE FROM "Usuarios" WHERE id = $1';
    const values = [id];
    
    try {
        await pool.query(query, values);
        console.log('Usuario eliminado exitosamente.');
    } catch (error) {
        console.error('Error al eliminar usuario:', error.message);
        throw error;
    }
}

async function getAllUsers() {
    const query = 'SELECT * FROM "Usuarios"';
    
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error al obtener todos los usuarios:', error.message);
        throw error;
    }
}

async function findUserById(id) {
    const query = 'SELECT * FROM "Usuarios" WHERE id = $1';
    const values = [id];
    
    try {
        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            return result.rows[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error al encontrar usuario por ID:', error.message);
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
    updateUser,
    deleteUser,
    getAllUsers,
    findUserById,
    authenticateUser
};
