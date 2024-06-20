const { body, query, param, header, validationResult } = require('express-validator');

const sanitizeAndValidateInput = async (req, res, next) => {
    await Promise.all([
        // Validar y sanitizar body
        body('*').customSanitizer(value => typeof value === 'string' ? value.replace(/['"\\;(){}]/g, '') : value).run(req),
        // Validar y sanitizar query
        query('*').customSanitizer(value => typeof value === 'string' ? value.replace(/['"\\;(){}]/g, '') : value).run(req),
        // Validar y sanitizar params
        param('*').customSanitizer(value => typeof value === 'string' ? value.replace(/['"\\;(){}]/g, '') : value).run(req),
        // Validar y sanitizar headers (solo los necesarios)
        header(['cf-visitor', 'cdn-loop']).customSanitizer(value => typeof value === 'string' ? value.replace(/['"\\;(){}]/g, '') : value).run(req),

        // Validación adicional para caracteres peligrosos
        body('*').not().matches(/['";]/).withMessage('Caracteres peligrosos detectados.').run(req),
        query('*').not().matches(/['";]/).withMessage('Caracteres peligrosos detectados.').run(req),
        param('*').not().matches(/['";]/).withMessage('Caracteres peligrosos detectados.').run(req),
        header(['cf-visitor', 'cdn-loop']).not().matches(/['";]/).withMessage('Caracteres peligrosos detectados.').run(req),
        body('*').not().matches(/--/).withMessage('Caracteres peligrosos detectados.').run(req),
        query('*').not().matches(/--/).withMessage('Caracteres peligrosos detectados.').run(req),
        param('*').not().matches(/--/).withMessage('Caracteres peligrosos detectados.').run(req),
        header(['cf-visitor', 'cdn-loop']).not().matches(/--/).withMessage('Caracteres peligrosos detectados.').run(req)
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Filtrar mensajes de error duplicados
        const filteredErrors = errors.array().reduce((acc, current) => {
            const x = acc.find(item => item.param === current.param);
            if (!x) {
                return acc.concat([current]);
            }
            return acc;
        }, []);
        
        return res.status(400).json({ errors: filteredErrors });
    }

    next();
};

module.exports = sanitizeAndValidateInput;
