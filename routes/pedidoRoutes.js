const express = require('express');
const router = express.Router();
const {
    crearPedido,
    obtenerTodosLosPedidos,
    obtenerPedidoPorId,
    actualizarPedidoPorId,
    eliminarPedidoPorId
} = require('../controllers/pedidoController');

router.post('/', crearPedido);
router.get('/', obtenerTodosLosPedidos);
router.get('/:id', obtenerPedidoPorId);
router.put('/:id', actualizarPedidoPorId);
router.delete('/:id', eliminarPedidoPorId);

module.exports = router;
