const Pedido = require('../models/pedidoModel');

// Crear un nuevo pedido
exports.crearPedido = async (req, res) => {
    try {
        const { id_venta, metodo_entrega, direccion_id, estado } = req.body;
        const newPedido = await Pedido.createPedido(id_venta, metodo_entrega, direccion_id, estado);
        res.status(201).json(newPedido);
    } catch (err) {
        console.error('Error creating pedido:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// Obtener todos los pedidos
exports.obtenerTodosLosPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.getAllPedidos();
        res.json(pedidos);
    } catch (err) {
        console.error('Error fetching pedidos:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// Obtener pedido por ID
exports.obtenerPedidoPorId = async (req, res) => {
    try {
        const pedido = await Pedido.getPedidoById(req.params.id);
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.json(pedido);
    } catch (err) {
        console.error('Error fetching pedido by ID:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// Actualizar un pedido
exports.actualizarPedidoPorId = async (req, res) => {
    try {
        const { id_venta, metodo_entrega, direccion_id, estado } = req.body;
        const updatedPedido = await Pedido.updatePedido(req.params.id, id_venta, metodo_entrega, direccion_id, estado);
        if (!updatedPedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.json(updatedPedido);
    } catch (err) {
        console.error('Error updating pedido:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// Eliminar un pedido
exports.eliminarPedidoPorId = async (req, res) => {
    try {
        await Pedido.deletePedido(req.params.id);
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting pedido:', err.message);
        res.status(500).json({ error: err.message });
    }
};
