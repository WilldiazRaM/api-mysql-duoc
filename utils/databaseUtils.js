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


async function createUser(email, password) {
    return new Promise(async (resolve, reject) => {
        try {
            const hashedPassword = await hashPassword(password);
            const role = 'cliente'; // Asignar un rol predeterminado
            const query = 'INSERT INTO Usuarios (email, password, role, created_at) VALUES (?, ?, ?, NOW())';
            pool.query(query, [email, hashedPassword, role], (error, result) => {
                if (error) {
                    console.error("Error en createUser:", error);
                    return reject(error);
                }
                const newUserId = result.insertId;
                // Resolver con los datos del usuario registrado
                resolve({ id: newUserId, email, role, created_at: new Date() });
            });
        } catch (error) {
            console.error("Error al crear usuario:", error);
            reject(error);
        }
    });
};

async function authenticateUser(email, password) {
    const query = 'SELECT * FROM Usuarios WHERE email = ?';
    const [rows] = await pool.query(query, [email]);
    const user = rows[0];

    if (user && await bcrypt.compare(password, user.password)) {
        return user;
    } else {
        return null;
    }
};





module.exports = { findByEmail, createUser, findUserById, authenticateUser };
