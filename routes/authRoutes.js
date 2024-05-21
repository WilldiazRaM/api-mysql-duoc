const express = require('express');
const router = express.Router();
const { login, register, logout } = require('../controllers/authController');
const passport = require('./passportConfig');

// Ruta para iniciar sesión local
router.post('/login', login);
router.post('/registrar', register); 
router.get('/logout', logout);


//GOOGLE
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/auth/login'
}), (req, res) => {
    // Generar JWT después de la autenticación exitosa
    const token = jwt.sign({ id: req.user.id, provider: 'google' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`/profile?token=${token}`);
});

//GITHUB
router.get('/github', passport.authenticate('github')); 
router.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/auth/login'
}), (req, res) => {
    // Generar JWT después de la autenticación exitosa
    const token = jwt.sign({ id: req.user.id, provider: 'github' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`/profile?token=${token}`);
});

router.get('/login', (req, res) => {
    res.sendFile('login.html', { root: './public/login' });
});


module.exports = router;
