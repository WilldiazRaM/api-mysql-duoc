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
    };
} 


module.exports = { findByemail };