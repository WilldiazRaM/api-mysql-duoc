const pool = require('../database');

async function findByEmail(email) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Usuarios WHERE email = ?', [email], (err, rows) => {
            if (err) {
                reject(err); // Rechazar la promesa si hay un error en la consulta
            } else {
                if (rows.length === 0) {
                    resolve(null); // Resolver la promesa con null si no se encuentra ningún usuario
                } else {
                    resolve(rows[0]); // Resolver la promesa con el primer usuario encontrado
                }
            }
        });
    });
}


async function findUserById(id) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Usuarios WHERE id = ?', [id], (err, rows) => {
            if (err) {
                reject(err); // Rechazar la promesa si hay un error en la consulta
            } else {
                if (rows.length === 0) {
                    resolve(null); // Resolver la promesa con null si no se encuentra ningún usuario
                } else {
                    resolve(rows[0]); // Resolver la promesa con el primer usuario encontrado
                }
            }
        });
    });
};


function createUser(user) {
    return new Promise((resolve, reject) => {
        const { nombre, email, password, role } = user;
        console.log("Datos de usuario:", nombre, email, password, role);
        const query = 'INSERT INTO Usuarios (nombre, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())';
        console.log("Query SQL:", query);
        
        
        pool.query(query, [nombre, email, password, role || 'cliente'], (error, result) => {
            if (error) {
                console.error("Error en createUser:", error);
                return reject(error);
            }
            const newUserId = result.insertId;
            console.log("ID de usuario creado:", newUserId);

            // Retorna el nuevo usuario con el ID asignado
            resolve({ id: newUserId, nombre, email, password, role: role || 'cliente', created_at: new Date() });
        });
    });
};






module.exports = { findByEmail, createUser, findUserById };
