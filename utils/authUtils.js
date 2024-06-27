// authUtils.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secretoSuperSeguro';

const isAuthenticated = (req, res, next) => {
    console.log('Verificando autenticación');

    if (req.user && req.user.provider === 'google') {
        console.log('Usuario autenticado a través de Google:', req.user);
        return next();
    }

    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1] || req.query.token;
    console.log('Token:', token);

    if (token) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error('Error verificando token JWT:', err);
                return res.status(401).json({ error: 'Token inválido o expirado' });
            }

            console.log('Token decodificado:', decoded);
            req.user = decoded;
            return next();
        });
    } else {
        console.log('No autenticado y no se encontró token');
        return res.status(401).json({ error: 'No autenticado: Se requiere un token válido' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    } else {
        return res.status(403).json({ error: 'Acceso denegado: Se requieren permisos de administrador' });
    }
};

module.exports = { isAuthenticated, isAdmin };
