const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

async function comparePasswords(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
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

// Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}


module.exports = { hashPassword, comparePasswords, requireAuth, isAuthenticated };
