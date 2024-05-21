const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secretoSuperSeguro';

function isAuthenticated(req, res, next) {
    console.log('Verificando autenticación');

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


module.exports = { isAuthenticated };
