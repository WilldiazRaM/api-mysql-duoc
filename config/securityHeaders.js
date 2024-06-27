module.exports = (req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubdomains');
    res.setHeader('Content-Security-Policy', "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://kit.fontawesome.com; frame-src 'self' https://giphy.com;");
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Permissions-Policy', "geolocation=(self), microphone=(), camera=()");
    next();
};
