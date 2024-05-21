const express = require('express');
const router = express.Router();
const { login, register, logout } = require('../controllers/authController');
const { requireAuth, isAuthenticated } = require('../utils/passwordUtils');
const passport = require('./passportConfig');

// Ruta para iniciar sesión local
router.post('/login', login);
router.post('/registrar', register); 
router.get('/logout', logout);

// Ruta para iniciar sesión con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Ruta de callback después de la autenticación con Google
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/profile');
});

// Ruta para iniciar sesión con GitHub
router.get('/github', passport.authenticate('github'));

// Ruta de callback después de la autenticación con GitHub
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/profile');
});

// Ruta para la vista de perfil
router.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.user });
});

module.exports = router;
