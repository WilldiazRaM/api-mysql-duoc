const express = require('express');
const router = express.Router();
const { crearVenta, obtenerTodasLasVentas, obtenerVenta, actualizarVentaPorId, eliminarVentaPorId } = require('../controllers/ventasController');
const { checkHeaders, sqlInjectionFilter } = require('../middleware/sqlInjectionFilter');

// Aplicar el middleware de filtrado de inyecciones SQL
router.use(sqlInjectionFilter);


// Crear una venta
router.post('/', crearVenta);

// Obtener todas las ventas
router.get('/', obtenerTodasLasVentas);

// Obtener una venta por su ID
router.get('/:id', obtenerVenta);

// Actualizar una venta por su ID
router.put('/:id', actualizarVentaPorId);

// Eliminar una venta por su ID
router.delete('/:id', eliminarVentaPorId);

module.exports = router;
