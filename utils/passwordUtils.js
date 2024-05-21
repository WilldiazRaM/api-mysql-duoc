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

function isAuthenticated(req, res, next) {
    console.log('Verificando autenticación');
    console.log('Usuario autenticado:', req.isAuthenticated());
    console.log('req.user:', req.user);

    if (req.isAuthenticated()) {
        // Si el usuario está autenticado mediante Passport
        console.log('Autenticado por Passport');
        return next();
    }

    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    console.log('Token:', token);

    if (token) {
        // Verificar el token JWT
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error('Error verificando token JWT:', err);
                return res.redirect('/auth/login');
            }

            console.log('Token decodificado:', decoded);
            req.user = decoded; // Establecer el usuario decodificado en la solicitud
            return next();
        });
    } else {
        // Redirigir al usuario al inicio de sesión si no está autenticado
        console.log('No autenticado y no se encontró token');
        return res.redirect('/auth/login');
    }
}


module.exports = { hashPassword, comparePasswords, requireAuth, isAuthenticated };
