const pool = require('../database');

async function findUserByEmail(email) {
    const query = 'SELECT * FROM Usuarios WHERE email = ?';
    const [rows] = await pool.query(query, [email]);
    if (rows.length > 0) {
        return rows[0];
    } else {
        return null; // O cualquier otro valor que indique que el usuario no fue encontrado
    }
}


async function createUser(email, hashedPassword) {
    const query = 'INSERT INTO Usuarios (email, password) VALUES (?, ?)';
    await pool.query(query, [email, hashedPassword]);
}

module.exports = {
    findUserByEmail,
    createUser
};
