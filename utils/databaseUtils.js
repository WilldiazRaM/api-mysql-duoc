const db = require('./database');

async function findByemail(email) {
    try {
        const rows = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length === 0){
            return null;
        }
        return rows[0];
    }catch(err){
        throw err;
    }
}; 

async function createUser(user) {
    try {
        const { email, password } = user;
        const query = 'INSERT INTO usuarios (email, password) VALUES (?, ?)';
        const result = await db.query(query, [email, password]);

        // Obtén el ID del usuario recién insertado (si lo necesitas)
        const newUserId = result.insertId;

        // Retorna el nuevo usuario con el ID asignado
        return { id: newUserId, email, password };
    } catch (error) {
        throw error;
    }
}




module.exports = { findByemail, createUser };