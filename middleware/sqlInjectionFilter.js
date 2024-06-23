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
    for (let key in req.body) {
        if (checkForDangerousChars(req.body[key])) {
            return res.status(400).send('Caracteres peligrosos detectados. \n with ❤️ from 🇨🇱 👊👊👊 ');
        }
    }
    for (let key in req.params) {
        if (checkForDangerousChars(req.params[key])) {
            return res.status(400).send('Caracteres peligrosos detectados. \n with ❤️ from 🇨🇱 👊👊👊 ');
        }
    }
    for (let key in req.query) {
        if (checkForDangerousChars(req.query[key])) {
            return res.status(400).send('Caracteres peligrosos detectados. \n with ❤️ from 🇨🇱 👊👊👊 ');
        }
    }
    next();
};

const checkHeaders = (fields) => {
    return [
        ...fields.map(field => {
            switch (field) {
                case 'x-email':
                    return check(field).isEmail().withMessage('Debe ser un correo electrónico válido');
                case 'x-password':
                    return check(field).isString().withMessage('La contraseña debe ser una cadena');
                case 'x-nombre':
                    return check(field).isString().withMessage('El nombre de usuario debe ser una cadena');
                case 'x-role':
                    return check(field).isString().withMessage('El rol debe ser una cadena');
                default:
                    return check(field).exists().withMessage(`El campo ${field} es requerido`);
            }
        }),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ];
};

module.exports = sqlInjectionFilter, checkHeaders;