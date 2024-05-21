const express = require('express');
const router = express.Router();
const { login, register, logout } = require('../controllers/authController');
const passport = require('./passportConfig');
const jwt = require('jsonwebtoken');


// Ruta para iniciar sesión local
router.post('/login', login);
router.post('/registrar', register); 
router.get('/logout', logout);

// Ruta para cargar la página de inicio de sesión
router.get('/login', (req, res) => {
    res.sendFile('login.html', { root: './public/login' });
});



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
// Ruta para iniciar sesión con GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Ruta de callback para GitHub
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/auth/login' }), (req, res) => {
    const token = jwt.sign({ id: req.user.id, provider: 'github' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`/profile?token=${token}`);
});





module.exports = router;
