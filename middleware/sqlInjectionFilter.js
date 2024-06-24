const { check, validationResult } = require('express-validator');

const dangerousChars = /['";]/;
const dangerousSequence = /--/;

const checkForDangerousChars = (input) => {
    if (dangerousChars.test(input) || dangerousSequence.test(input)) {
        return true;
    }
    return false;
};

const sqlInjectionFilter = (req, res, next) => {
    // Exclude OAuth routes from the filter
    const oauthRoutes = ['/auth/google', '/auth/google/callback', '/auth/github', '/auth/github/callback'];
    if (oauthRoutes.includes(req.path) && req.method === 'GET') {
        return next();
    }

    // Verify req.body
    for (let key in req.body) {
        if (checkForDangerousChars(req.body[key])) {
            console.log(`Dangerous characters detected in req.body.${key}: ${req.body[key]}`);
            return res.status(400).send('Dangerous characters detected. with ❤️ from 🇨🇱 👊👊👊');
        }
    }
    // Verify req.params
    for (let key in req.params) {
        if (checkForDangerousChars(req.params[key])) {
            console.log(`Dangerous characters detected in req.params.${key}: ${req.params[key]}`);
            return res.status(400).send('Dangerous characters detected. with ❤️ from 🇨🇱 👊👊👊');
        }
    }
    // Verify req.query
    for (let key in req.query) {
        if (checkForDangerousChars(req.query[key])) {
            console.log(`Dangerous characters detected in req.query.${key}: ${req.query[key]}`);
            return res.status(400).send('Dangerous characters detected. with ❤️ from 🇨🇱 👊👊👊');
        }
    }
    // Verify req.headers
    for (let key in req.headers) {
        if (checkForDangerousChars(req.headers[key])) {
            console.log(`Dangerous characters detected in req.headers.${key}: ${req.headers[key]}`);
            return res.status(400).send('Dangerous characters detected. with ❤️ from 🇨🇱 👊👊👊');
        }
    }
    next();
};


const checkHeaders = (fields) => {
    return [
        // Verificar si los campos están vacíos
        (req, res, next) => {
            const errors = [];
            fields.forEach(field => {
                if (!req.headers[field] || req.headers[field].trim() === '') {
                    errors.push({ msg: `El campo ${field} es requerido`, path: field, location: 'headers' });
                }
            });
            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }
            next();
        },
        // Validaciones específicas para cada campo
        ...fields.map(field => {
            switch (field) {
                case 'x-email':
                    return check(field).isEmail().withMessage('Debe ser un correo electrónico válido').bail();
                case 'x-password':
                    return check(field).isString().withMessage('La contraseña debe ser una cadena').bail();
                case 'x-nombre':
                    return check(field).isString().withMessage('El nombre de usuario debe ser una cadena').bail();
                case 'x-role':
                    return check(field).isString().withMessage('El rol debe ser una cadena').bail();
                default:
                    return check(field).exists().withMessage(`El campo ${field} es requerido`).bail();
            }
        }),
        // Manejar errores de validación
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array().map(err => ({ msg: err.msg, path: err.param, location: 'headers' })) });
            }
            next();
        }
    ];
};

module.exports = {
    sqlInjectionFilter,
    checkHeaders,
    checkForDangerousChars
};
