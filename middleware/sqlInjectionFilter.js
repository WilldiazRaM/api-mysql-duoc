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

module.exports = sqlInjectionFilter;