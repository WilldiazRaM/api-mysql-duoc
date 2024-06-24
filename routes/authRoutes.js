const express = require('express');
const router = express.Router();
const passport = require('passport');
const { checkHeaders } = require('../middleware/sqlInjectionFilter');
const { login, register, logout } = require('../controllers/authController');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Rutas de autenticación locales
router.post('/login', checkHeaders(['x-email', 'x-password']), login);

router.post('/registrar', checkHeaders(['x-nombre', 'x-email', 'x-password', 'x-role']), register);

router.get('/logout', logout);

// Ruta para cargar la página de inicio de sesión
router.get('/login', (req, res) => {
    res.sendFile('login.html', { root: './public/login' });
});

// GOOGLE
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/auth/login' 
}), (req, res) => {
    const token = jwt.sign({ id: req.user.id, provider: 'google' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`/profile?token=${token}`);
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/auth/login' }), (req, res) => {
    const token = jwt.sign({ id: req.user.id, provider: 'github' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`/profile?token=${token}`);
});

// Ruta para comparar contraseñas manualmente
router.get('/debug/compare', async (req, res) => {
    const plainPassword = 'password123.';
    const hashedPassword = '$2b$10$gUIv0aHyC1n/p1EPRHRchOUBnGF2gkYMpvB/urCL2QKg9xBJv8rJW'; // Reemplaza con la contraseña hash de la base de datos

    try {
        const result = await bcrypt.compare(plainPassword, hashedPassword);
        res.status(200).json({ isValid: result });
    } catch (err) {
        console.error('Error al comparar contraseñas:', err);
        res.status(500).json({ error: 'Error al comparar contraseñas' });
    }
});

module.exports = router;
