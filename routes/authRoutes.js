const express = require('express');
const router = express.Router();
const { login, register, logout } = require('../controllers/authController');
const passport = require('./passportConfig');
const { isAuthenticated } = require('../utils/passwordUtils');

// Ruta para iniciar sesión local
router.post('/login', login);
router.post('/registrar', register); 
router.get('/logout', logout);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth/login' }), (req, res) => {
    res.redirect('/profile');
});

router.get('/github', passport.authenticate('github'));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/auth/login' }), (req, res) => {
    res.redirect('/profile');
});

router.get('/login', (req, res) => {
    res.sendFile('login.html', { root: './public/login' });
});

module.exports = router;
