const express = require('express');
const router = express.Router();
const { login, register, logout } = require('../controllers/authController');
const { requireAuth } = require('../utils/passwordUtils');

router.post('/login', login);
router.post('/registrar',requireAuth(JWT_SECRET), register); //SE AGREGA REQUIRE AUTH VER FUNCS
router.get('/logout', requireAuth(JWT_SECRET), logout);

module.exports = router;
