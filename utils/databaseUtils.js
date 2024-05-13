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
    return new Promise((resolve, reject) => {
        
        const newUserId = records.length + 1;

        // Crea el nuevo usuario con el ID asignado
        const newUser = {
            id: newUserId,
            ...user,
        };

        // Añade el nuevo usuario a la lista de registros
        records.push(newUser);

        // Muestra los registros actualizados en la consola (opcional)
        console.log(records);

        
        resolve(newUser);
    });
}



module.exports = { findByemail, createUser };