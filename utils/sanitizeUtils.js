// utils/sanitizeUtils.js

const sanitize = (req, res, next) => {
    const dangerousChars = /['";]/;
    const dangerousSequence = /--/;

    const checkForDangerousChars = (input) => {
        if (dangerousChars.test(input) || dangerousSequence.test(input)) {
            return true;
        }
        return false;
    };

    const sanitizeString = (str) => {
        return str.replace(/['"\\;(){}]/g, '');
    };

    const sanitizeObject = (obj) => {
        for (let key in obj) {
            if (typeof obj[key] === 'string') {
                // Check for dangerous characters
                if (checkForDangerousChars(obj[key])) {
                    return false; // Dangerous characters found
                }
                // Sanitize the string
                obj[key] = sanitizeString(obj[key]);
            } else if (typeof obj[key] === 'object') {
                if (!sanitizeObject(obj[key])) {
                    return false; // Dangerous characters found in nested object
                }
            }
        }
        return true; // No dangerous characters found
    };

    // Sanitize request objects
    if (!sanitizeObject(req.body) || !sanitizeObject(req.query) || !sanitizeObject(req.params) || !sanitizeObject(req.headers)) {
        return res.status(400).send('Caracteres peligrosos detectados. \n with ❤️ from 🇨🇱 👊👊👊 \n Cityfy 💒');
    }

    next();
};

module.exports = sanitize;
