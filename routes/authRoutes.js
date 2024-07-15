const express = require('express');
const router = express.Router();
const passport = require('passport');
const { check, validationResult } = require('express-validator');
const { login, register, logout } = require('../controllers/authController');
const jwt = require('jsonwebtoken');
const { checkHeaders, sqlInjectionFilter } = require('../middleware/sqlInjectionFilter');
const bcrypt = require('bcrypt');

// Aplicar el middleware de filtrado de inyecciones SQL
router.use(sqlInjectionFilter);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Email del usuario
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *       example:
 *         email: user@example.com
 *         password: userpassword
 *     Register:
 *       type: object
 *       required:
 *         - nombre
 *         - email
 *         - password
 *         - role
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del usuario
 *         email:
 *           type: string
 *           description: Email del usuario
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *         role:
 *           type: string
 *           description: Rol del usuario
 *       example:
 *         nombre: Juan Perez
 *         email: juan@example.com
 *         password: securepassword
 *         role: admin
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *       400:
 *         description: Email y contraseña son requeridos
 *       401:
 *         description: Credenciales incorrectas
 */
// Rutas de autenticación locales
router.post('/login', checkHeaders(['x-email', 'x-password']), login);

/**
 * @swagger
 * /auth/registrar:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     parameters:
 *       - in: header
 *         name: x-nombre
 *         required: true
 *         description: Nombre del usuario
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-email
 *         required: true
 *         description: Email del usuario
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-password
 *         required: true
 *         description: Contraseña del usuario
 *         schema:
 *           type: string
 *       - in: header
 *         name: x-role
 *         required: true
 *         description: Rol del usuario
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Nombre, email, contraseña y rol son requeridos
 *       409:
 *         description: El correo electrónico ya está en uso
 */


router.post('/registrar', (req, res, next) => {
    const nombre = req.headers['x-nombre'];
    const email = req.headers['x-email'];
    const password = req.headers['x-password'];
    const role = req.headers['x-role'];

    const errors = [];

    if (!nombre || typeof nombre !== 'string') {
        errors.push({ msg: 'El nombre de usuario debe ser una cadena', path: 'username' });
    }
    if (!password || typeof password !== 'string') {
        errors.push({ msg: 'La contraseña debe ser una cadena', path: 'password' });
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        errors.push({ msg: 'Debe ser un correo electrónico válido', path: 'email' });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    req.body.username = nombre;
    req.body.password = password;
    req.body.email = email;
    req.body.role = role;

    next();
}, register);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Cerrar sesión
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 */

router.get('/logout', logout);

/**
 * @swagger
 * /auth/login:
 *   get:
 *     summary: Cargar la página de inicio de sesión
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Página de inicio de sesión cargada
 */

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
