const express = require('express');
const router = express.Router();
const { crearDetalleVenta, obtenerTodosLosDetallesVenta, obtenerDetalleVenta, actualizarDetalleVentaPorId, eliminarDetalleVentaPorId } = require('../controllers/detalleVentaController');
const { checkHeaders, sqlInjectionFilter } = require('../middleware/sqlInjectionFilter');
// Aplicar el middleware de filtrado de inyecciones SQL
router.use(sqlInjectionFilter);s


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
