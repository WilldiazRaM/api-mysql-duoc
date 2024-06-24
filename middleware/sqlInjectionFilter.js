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
        return next();
    }

    // Verificar req.body
    for (let key in req.body) {
        if (checkForDangerousChars(req.body[key])) {
            return res.status(400).send('Caracteres peligrosos detectados. with ❤️ from 🇨🇱 👊👊👊');
        }
    }
    // Verificar req.params
    for (let key in req.params) {
        if (checkForDangerousChars(req.params[key])) {
            return res.status(400).send('Caracteres peligrosos detectados. with ❤️ from 🇨🇱 👊👊👊');
        }
    }
    // Verificar req.query
    for (let key in req.query) {
        if (checkForDangerousChars(req.query[key])) {
            return res.status(400).send('Caracteres peligrosos detectados. with ❤️ from 🇨🇱 👊👊👊');
        }
    }
    // Verificar req.headers, excluyendo encabezados comunes
    const excludedHeaders = [
        'user-agent', 'accept', 'accept-encoding', 'cdn-loop', 'referer', 'connection', 'host', 'cf-connecting-ip',
        'cf-ew-via', 'cf-ipcountry', 'cf-ray', 'cf-visitor', 'accept-language', 'cache-control', 'pragma', 'true-client-ip',
        'x-forwarded-for', 'x-forwarded-proto', 'x-request-start', 'sec-ch-ua', 'sec-ch-ua-mobile', 'sec-ch-ua-platform',
        'upgrade-insecure-requests', 'origin', 'content-length', 'content-type', 'x-requested-with', 'sec-fetch-site',
        'sec-fetch-mode', 'sec-fetch-user', 'sec-fetch-dest', 'sec-fetch-secure', 'dnt', 'early-data', 'priority', 'cf-worker',
        'if-modified-since', 'if-none-match', 'render-proxy-ttl', 'rndr-id'
    ];

    for (let key in req.headers) {
        if (excludedHeaders.includes(key.toLowerCase())) {
            continue; // Excluir estos encabezados de la verificación
        }
        if (checkForDangerousChars(req.headers[key])) {
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
                return next();
            }

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
