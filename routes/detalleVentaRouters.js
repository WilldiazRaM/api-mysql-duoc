const express = require('express');
const router = express.Router();
const { crearDetalleVenta, obtenerTodosLosDetallesVenta, obtenerDetalleVenta, actualizarDetalleVentaPorId, eliminarDetalleVentaPorId } = require('../controllers/detalleVentaController');

// Crear un detalle de venta
router.post('/', crearDetalleVenta);

// Obtener todos los detalles de venta
router.get('/', obtenerTodosLosDetallesVenta);

// Obtener un detalle de venta por su ID
router.get('/:id', obtenerDetalleVenta);

// Actualizar un detalle de venta por su ID
router.put('/:id', actualizarDetalleVentaPorId);

// Eliminar un detalle de venta por su ID
router.delete('/:id', eliminarDetalleVentaPorId);

module.exports = router;
