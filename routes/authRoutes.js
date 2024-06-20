const express = require('express');
const router = express.Router();
const passport = require('passport');
const { login, register, logout } = require('../controllers/authController');
const jwt = require('jsonwebtoken');



// Rutas de autenticación locales
router.post('/login', login);
router.post('/registrar',  register); 
router.get('/logout', logout);

// Ruta para cargar la página de inicio de sesión
router.get('/login', (req, res) => {
    res.sendFile('login.html', { root: './public/login' });
});

// GOOGLE
// Ruta para iniciar el proceso de autenticación con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Ruta para manejar la respuesta de Google después de la autenticación
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/auth/login' // Redirigir en caso de fallo
}), (req, res) => {
    console.log('Autenticación con Google exitosa');

    // Generar un token JWT
    const token = jwt.sign({ id: req.user.id, provider: 'google' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Redirigir al usuario a la pantalla de perfil con el token JWT
    res.redirect(`/profile?token=${token}`);
});

// Ruta para iniciar sesión con GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/auth/login' }), (req, res) => {
    const token = jwt.sign({ id: req.user.id, provider: 'github' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`/profile?token=${token}`);
});


module.exports = router;
