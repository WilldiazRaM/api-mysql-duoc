const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../server');




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


function requireAuth(JWT_SECRET) {
    return function(req, res, next) {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "Token de autorización no proporcionado" });
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Token inválido" });
            }

            // Agrega el usuario decodificado al objeto de solicitud para que pueda ser utilizado por otras rutas
            req.user = decoded;
            next();
        });
    };
}


module.exports = { hashPassword, comparePasswords, requireAuth };
