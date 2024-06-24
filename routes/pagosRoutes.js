const express = require('express');
const router = express.Router();
const { iniciarTransaccion, confirmarTransaccion } = require('../controllers/pagoController');

router.post('/iniciar', iniciarTransaccion);
router.put('/confirmar/:token', confirmarTransaccion);

module.exports = router;
