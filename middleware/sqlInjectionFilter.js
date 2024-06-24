const { check, validationResult } = require('express-validator');

const checkForDangerousChars = (input) => {
    const dangerousChars = /['";]/;
    const dangerousSequence = /--/;
    if (dangerousChars.test(input) || dangerousSequence.test(input)) {
        return true;
    }
    return false;
};

const sqlInjectionFilter = (req, res, next) => {
    // Excluir rutas OAuth del filtro
    const oauthRoutes = ['/auth/google', '/auth/google/callback', '/auth/github', '/auth/github/callback'];
    if (oauthRoutes.includes(req.path) && req.method === 'GET') {
        console.log(`Ruta OAuth detectada: ${req.path}`);
        return next();
    }

    // Verificar req.body
    for (let key in req.body) {
        console.log(`Verificando req.body.${key}: ${req.body[key]}`);
        if (checkForDangerousChars(req.body[key])) {
            console.log(`Caracteres peligrosos detectados en req.body.${key}: ${req.body[key]}`);
            return res.status(400).send('Caracteres peligrosos detectados. with ❤️ from 🇨🇱 👊👊👊');
        }
    }
    // Verificar req.params
    for (let key in req.params) {
        console.log(`Verificando req.params.${key}: ${req.params[key]}`);
        if (checkForDangerousChars(req.params[key])) {
            console.log(`Caracteres peligrosos detectados en req.params.${key}: ${req.params[key]}`);
            return res.status(400).send('Caracteres peligrosos detectados. with ❤️ from 🇨🇱 👊👊👊');
        }
    }
    // Verificar req.query
    for (let key in req.query) {
        console.log(`Verificando req.query.${key}: ${req.query[key]}`);
        if (checkForDangerousChars(req.query[key])) {
            console.log(`Caracteres peligrosos detectados en req.query.${key}: ${req.query[key]}`);
            return res.status(400).send('Caracteres peligrosos detectados. with ❤️ from 🇨🇱 👊👊👊');
        }
    }
    // Verificar req.headers, excluyendo más encabezados comunes
    const excludedHeaders = ['user-agent', 'accept', 'accept-encoding', 'cdn-loop', 'referer', 'connection', 'host', 'cf-connecting-ip', 'cf-ew-via', 'cf-ipcountry', 'cf-ray', 'cf-visitor', 'accept-language', 'cache-control', 'pragma'];
    for (let key in req.headers) {
        if (excludedHeaders.includes(key.toLowerCase())) {
            console.log(`Excluyendo req.headers.${key} de la verificación`);
            continue; // Excluir estos encabezados de la verificación
        }
        console.log(`Verificando req.headers.${key}: ${req.headers[key]}`);
        if (checkForDangerousChars(req.headers[key])) {
            console.log(`Caracteres peligrosos detectados en req.headers.${key}: ${req.headers[key]}`);
            return res.status(400).send('Caracteres peligrosos detectados. with ❤️ from 🇨🇱 👊👊👊');
        }
    }
    next();
};

const checkHeaders = (fields) => {
    return [
        // Verificar si los campos están vacíos
        (req, res, next) => {
            const oauthRoutes = ['/auth/google', '/auth/google/callback', '/auth/github', '/auth/github/callback'];
            if (oauthRoutes.includes(req.path) && req.method === 'GET') {
                console.log(`Ruta OAuth detectada en checkHeaders: ${req.path}`);
                return next();
            }

            const errors = [];
            fields.forEach(field => {
                if (!req.headers[field] || req.headers[field].trim() === '') {
                    console.log(`Campo vacío detectado en headers: ${field}`);
                    errors.push({ msg: `El campo ${field} es requerido`, path: field, location: 'headers' });
                }
            });
            if (errors.length > 0) {
                console.log(`Errores de validación de headers:`, errors);
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
                console.log(`Errores de validación específicos:`, errors.array());
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
