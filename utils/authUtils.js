const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secretoSuperSeguro';

const isAuthenticated = (req, res, next) => {
    console.log('Verificando autenticación');

    // Verificar si el usuario está autenticado a través de Google
    if (req.user && req.user.provider === 'google') {
        console.log('Usuario autenticado a través de Google:', req.user);
        return next();
    }

    // Si no está autenticado a través de Google, verificar si hay un token JWT en el encabezado
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
};


module.exports = { isAuthenticated };
