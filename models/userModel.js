const pool = require('../database');

async function findUserByEmail(email) {
    const query = 'SELECT * FROM Usuarios WHERE email = ?';
    const [rows] = await pool.query(query, [email]);
    return rows[0];
}

async function createUser(email, hashedPassword) {
    const query = 'INSERT INTO Usuarios (email, password) VALUES (?, ?)';
    await pool.query(query, [email, hashedPassword]);
}

module.exports = {
    findUserByEmail,
    createUser
};
