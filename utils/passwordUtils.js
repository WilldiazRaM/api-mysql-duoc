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
    if (req.isAuthenticated() || (req.user && (req.user.provider === 'google' || req.user.provider === 'github'))) {
        return next();
    }

    // Verificar el token JWT si está presente
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (token) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error('Error verificando token JWT:', err);
                return res.redirect('/auth/login');
            }

            // Token válido, seguir al siguiente middleware
            req.user = decoded; // Opcional: puedes establecer req.user con la información decodificada del token
            return next();
        });
    } else {
        // Ni autenticado ni token presente, redirigir a login
        return res.redirect('/auth/login');
    }
}

module.exports = { hashPassword, comparePasswords, requireAuth, isAuthenticated };
