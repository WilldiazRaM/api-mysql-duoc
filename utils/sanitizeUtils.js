// utils/validationMiddleware.js
const { body, query, param, header, validationResult } = require('express-validator');

const sanitizeAndValidateInput = async (req, res, next) => {
    await Promise.all([
        // Validar y sanitizar body
        body('*').customSanitizer(value => typeof value === 'string' ? value.replace(/['"\\;(){}]/g, '') : value).run(req),
        // Validar y sanitizar query
        query('*').customSanitizer(value => typeof value === 'string' ? value.replace(/['"\\;(){}]/g, '') : value).run(req),
        // Validar y sanitizar params
        param('*').customSanitizer(value => typeof value === 'string' ? value.replace(/['"\\;(){}]/g, '') : value).run(req),
        // Validar y sanitizar headers
        header('*').customSanitizer(value => typeof value === 'string' ? value.replace(/['"\\;(){}]/g, '') : value).run(req),

        // Validación adicional para caracteres peligrosos
        body('*').not().matches(/['";]/).withMessage('Caracteres peligrosos detectados.').run(req),
        query('*').not().matches(/['";]/).withMessage('Caracteres peligrosos detectados.').run(req),
        param('*').not().matches(/['";]/).withMessage('Caracteres peligrosos detectados.').run(req),
        header('*').not().matches(/['";]/).withMessage('Caracteres peligrosos detectados.').run(req),
        body('*').not().matches(/--/).withMessage('Caracteres peligrosos detectados.').run(req),
        query('*').not().matches(/--/).withMessage('Caracteres peligrosos detectados.').run(req),
        param('*').not().matches(/--/).withMessage('Caracteres peligrosos detectados.').run(req),
        header('*').not().matches(/--/).withMessage('Caracteres peligrosos detectados.').run(req)
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    next();
};

module.exports = sanitizeAndValidateInput;
