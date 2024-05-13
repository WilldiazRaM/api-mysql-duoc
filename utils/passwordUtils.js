const bcrypt = require('bcrypt');

async function hashPassword(password) {
    try {
        const saltRounds = 10; // Número de rounds de hashing
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Error al generar el hash de la contraseña:', error);
        throw new Error('Error al generar el hash de la contraseña');
    }
}


async function comparePasswords(plainPassword, hashedPassword) {
    try {
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        return match;
    } catch (error) {
        console.error('Error al comparar contraseñas:', error);
        return false;
    }
};


module.exports = { hashPassword, comparePasswords };