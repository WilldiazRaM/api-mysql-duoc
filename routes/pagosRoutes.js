const express = require('express');
const router = express.Router();
const { iniciarTransaccion, confirmarTransaccion } = require('../controllers/pagoController');

router.post('/iniciar', iniciarTransaccion);
router.post('/confirmar', confirmarTransaccion);

module.exports = router;
