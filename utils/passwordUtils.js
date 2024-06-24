const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secretoSuperSeguro';

async function hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Contraseña hash generada en hashPassword:', hashedPassword);
    return hashedPassword;
}

async function comparePasswords(plainPassword, hashedPassword) {
    console.log('Contraseña en texto plano:', plainPassword);
    console.log('Contraseña hash de la BD:', hashedPassword);

    try {
        const result = await bcrypt.compare(plainPassword, hashedPassword);
        console.log('Resultado de la comparación en comparePasswords:', result);
        return result;
    } catch (err) {
        console.error('Error al comparar contraseñas:', err);
        return false;
    }
}


function requireAuth(JWT_SECRET) {
    return function(req, res, next) {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: "Token de autorización no proporcionado. Acceso Dennegado" });
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Token inválido" });
            }
            req.user = decoded;
            next();
        });
    };
}

module.exports = { hashPassword, comparePasswords, requireAuth, JWT_SECRET };
