const express = require('express');
const router = express.Router();
const { crearProducto, obtenerTodosLosProductos, obtenerProducto, actualizarProductoPorId, eliminarProductoPorId } = require('../controllers/productoController');

// Crear un producto
router.post('/', crearProducto);

// Obtener todos los productos
router.get('/', obtenerTodosLosProductos);

// Obtener un producto por su ID
router.get('/:id', obtenerProducto);

// Actualizar un producto por su ID
router.put('/:id', actualizarProductoPorId);

// Eliminar un producto por su ID
router.delete('/:id', eliminarProductoPorId);

module.exports = router;
