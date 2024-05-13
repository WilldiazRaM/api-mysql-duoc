const pool = require('../database');
const { hashPassword, comparePasswords } = require('./passwordUtils'); 

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
        const { nombre, email, password } = user;
        console.log("Datos de usuario:", nombre, email, password);
        
        // Generar hash de la contraseña
        hashPassword(password)
            .then(hashedPassword => {
                const query = 'INSERT INTO Usuarios (nombre, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())';
                console.log("Query SQL:", query);
                
                
                const role = user.role || 'cliente';
                
                pool.query(query, [nombre, email, hashedPassword, role], (error, result) => {
                    if (error) {
                        console.error("Error en createUser:", error);
                        return reject(error);
                    }
                    const newUserId = result.insertId;
                    console.log("ID de usuario creado:", newUserId);

                    // Retorna el nuevo usuario con el ID asignado y sin la contraseña
                    resolve({ id: newUserId, nombre, email, role, created_at: new Date() });
                });
            })
            .catch(error => {
                console.error("Error al cifrar la contraseña:", error);
                reject(error);
            });
    });
};








module.exports = { findByEmail, createUser, findUserById };
