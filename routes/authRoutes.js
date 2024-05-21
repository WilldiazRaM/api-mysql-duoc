const express = require('express');
const router = express.Router();
const path = require('path');
const { login, register, logout } = require('../controllers/authController');
const passport = require('./passportConfig');
const { isAuthenticated } = require('../utils/passwordUtils')

// Ruta para la vista de perfil
router.get('/profile', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login/profile.html')); 
});


// Ruta para iniciar sesión local
router.post('/login', login);
router.post('/registrar', register); 
router.get('/logout', logout);

// Ruta para iniciar sesión con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Ruta de callback después de la autenticación con Google
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/profile'); // Redirige al usuario a la página de perfil después de la autenticación exitosa
});


// Ruta para iniciar sesión con GitHub
router.get('/github', passport.authenticate('github'));

// Ruta de callback después de la autenticación con GitHub
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/profile'); // Redirige al usuario a la página de perfil después de la autenticación exitosa
});

// Ruta para la vista de perfil
router.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('profile', { user: req.user });
    } else {
        res.redirect('/login');
    }
});

// Ruta para la vista de login
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login/login.html'));
});

module.exports = router;
