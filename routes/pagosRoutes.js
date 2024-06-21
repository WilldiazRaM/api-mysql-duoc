const express = require('express');
const router = express.Router();
const { obtenerPagos, obtenerPagoPorId } = require('../controllers/pagoController');

// Obtener todos los pagos
router.get('/', obtenerPagos);

// Obtener un pago por su ID
router.get('/:id', obtenerPagoPorId);

module.exports = router;
