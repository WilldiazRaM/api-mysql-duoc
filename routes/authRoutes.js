const express = require('express');
const router = express.Router();
const { login, register, logout } = require('../controllers/authController');
const passport = require('./passportConfig');
const { isAuthenticated } = require('../utils/passwordUtils');

// Ruta para iniciar sesión local
router.post('/login', login);
router.post('/registrar', register); 
router.get('/logout', logout);

// Ruta para iniciar sesión con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Ruta de callback después de la autenticación con Google
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/profile'); // Redirige al usuario a la página de perfil después de la autenticación exitosa
});

// Ruta para iniciar sesión con GitHub
router.get('/github', passport.authenticate('github'));

// Ruta de callback después de la autenticación con GitHub
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/error' }), (req, res) => {
    res.redirect('/profile'); // Redirige al usuario a la página de perfil después de la autenticación exitosa
});


// Ruta para la vista de login
router.get('/login', (req, res) => {
    res.sendFile('login.html', { root: './public/login' }); // Enviar el archivo login.html desde la carpeta public/login
});

module.exports = router;
