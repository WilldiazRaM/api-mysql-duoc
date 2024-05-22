const pool = require('../database');
const { comparePasswords } = require('../utils/passwordUtils');

async function findUserByEmail(email) {
    const query = 'SELECT * FROM Usuarios WHERE email = ?';
    const [rows] = await pool.query(query, [email]);
    if (rows.length > 0) {
        return rows[0];
    } else {
        return null;
    }
}

async function createUser(email, hashedPassword) {
    const query = 'INSERT INTO Usuarios (email, password) VALUES (?, ?)';
    await pool.query(query, [email, hashedPassword]);
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
