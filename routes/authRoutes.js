const express = require('express');
const router = express.Router();
const { login, register, logout } = require('../controllers/authController');
const { requireAuth, isAuthenticated } = require('../utils/passwordUtils');
const { JWT_SECRET } = require('../controllers/authController');
const passport = require('./passportConfig');


router.post('/login', login);
router.post('/registrar',requireAuth(JWT_SECRET), register); //SE AGREGA REQUIRE AUTH VER FUNCS
router.get('/logout', logout);

// Ruta para iniciar sesión con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Ruta de callback después de la autenticación con Google
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    // Redirige al usuario a la página principal o a donde quieras después de la autenticación exitosa
    res.redirect('/login/profile.html');
});


// Ruta para iniciar sesión con GitHub
router.get('/github', passport.authenticate('github'));

// Ruta de callback después de la autenticación con GitHub
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    // Redirige al usuario a la página principal o a donde quieras después de la autenticación exitosa
    res.redirect('/login/profile.html');
});


router.get('/profile', requireAuth(JWT_SECRET), isAuthenticated, (req, res) => {
    // Código para manejar la solicitud de la vista de perfil
});

// Middleware de autorización para GitHub
router.get('/profile/github', passport.authenticate('github', { session: false }), (req, res) => {
    res.redirect('/profile');
});

module.exports = router;