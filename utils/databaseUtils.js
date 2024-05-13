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
};

function createUser(user) {
    return new Promise((resolve, reject) => {
        const { nombre, email, password, role } = user;
        console.log("Datos de usuario:", nombre, email, password, role);
        const query = 'INSERT INTO Usuarios (nombre, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())';
        console.log("Query SQL:", query);
        
        db.query(query, [nombre, email, password, role || 'cliente'])
            .then(result => {
                const newUserId = result.insertId;
                console.log("ID de usuario creado:", newUserId);

                // Retorna el nuevo usuario con el ID asignado
                resolve({ id: newUserId, nombre, email, role, created_at: new Date() });
            })
            .catch(error => {
                console.error("Error en createUser:", error);
                reject(error);
            });
    });
}



module.exports = { findByEmail, createUser };
