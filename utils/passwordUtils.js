const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secretoSuperSeguro';


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
    // Verificar si está autenticado por Passport
    if (req.isAuthenticated()) {
        return next();
    }

    // Verificar si el usuario está autenticado a través de Google o GitHub
    if (req.user && (req.user.provider === 'google' || req.user.provider === 'github')) {
        return next();
    }

    // Verificar autenticación JWT
    const token = req.headers['x-access-token'] || req.query.token || req.cookies.token;
    if (token) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.redirect('/auth/login');
            } else {
                req.user = decoded;
                return next();
            }
        });
    } else {
        // Si no hay ningún token, redirigir a la página de inicio de sesión
        console.log("no hay ningún token");
        res.redirect('/auth/login');
    }
}

module.exports = { hashPassword, comparePasswords, requireAuth, isAuthenticated };
