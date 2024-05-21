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
    // Verifica si el usuario está autenticado localmente
    if (req.isAuthenticated()) {
        return next();
    }
    // Verifica si el usuario está autenticado con Google o GitHub
    if (req.user && (req.user.provider === 'google' || req.user.provider === 'github')) {
        return next();
    }
    // Si el usuario no está autenticado, redirige al login
    res.redirect('/auth/login');
}

module.exports = { hashPassword, comparePasswords, requireAuth, isAuthenticated };
