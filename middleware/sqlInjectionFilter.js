const sqlInjectionFilter = (req, res, next) => {
    console.log('Request body before filter:', req.body); // Add this line for initial body logging
    // Exclude OAuth routes from the filter
    const oauthRoutes = ['/auth/google', '/auth/google/callback', '/auth/github', '/auth/github/callback'];
    if (oauthRoutes.includes(req.path) && req.method === 'GET') {
        console.log('OAuth route, skipping SQL injection filter');
        return next();
    }

    // Check req.body
    for (let key in req.body) {
        if (checkForDangerousChars(req.body[key])) {
            return res.status(400).send('Caracteres peligrosos detectados. with ❤️ from 🇨🇱 👊👊👊');
        }
    }

    // Check req.params
    for (let key in req.params) {
        if (checkForDangerousChars(req.params[key])) {
            return res.status(400).send('Caracteres peligrosos detectados. with ❤️ from 🇨🇱 👊👊👊');
        }
    }

    // Check req.query
    for (let key in req.query) {
        if (checkForDangerousChars(req.query[key])) {
            return res.status(400).send('Caracteres peligrosos detectados. with ❤️ from 🇨🇱 👊👊👊');
        }
    }

    // Check req.headers, excluding common headers
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
            continue; // Exclude these headers from the check
        }
        if (checkForDangerousChars(req.headers[key])) {
            return res.status(400).send('Caracteres peligrosos detectados. with ❤️ from 🇨🇱 👊👊👊');
        }
    }
    console.log('Request body after filter:', req.body); // Add this line for body logging after the filter
    next();
};

module.exports = { sqlInjectionFilter, checkHeaders, checkForDangerousChars };
