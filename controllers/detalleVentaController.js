const DetalleVenta = require('../models/detalleVentaModel');

exports.crearDetalleVenta = async (req, res) => {
    try {
        const { id_venta, id_producto, id_usuario, cantidad, precio_unitario } = req.body;
        const newDetalleVenta = await DetalleVenta.createDetalleVenta(id_venta, id_producto, id_usuario, cantidad, precio_unitario);
        res.status(201).json(newDetalleVenta);
    } catch (err) {
        console.error("Error creating sale detail:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.obtenerTodosLosDetallesVenta = async (req, res) => {
    try {
        const detallesVenta = await DetalleVenta.obtenerDetallesVenta();
        res.json(detallesVenta);
    } catch (err) {
        console.error("Error fetching sale details:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.obtenerDetalleVenta = async (req, res) => {
    try {
        const detalleVenta = await DetalleVenta.obtenerDetalleVentaPorId(req.params.id);
        if (!detalleVenta) {
            return res.status(404).json({ error: "Sale detail not found" });
        }
        res.json(detalleVenta);
    } catch (err) {
        console.error("Error fetching sale detail:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.actualizarDetalleVentaPorId = async (req, res) => {
    try {
        const { id_venta, id_producto, id_usuario, cantidad, precio_unitario } = req.body;
        const updatedDetalleVenta = await DetalleVenta.actualizarDetalleVenta(req.params.id, id_venta, id_producto, id_usuario, cantidad, precio_unitario);
        if (!updatedDetalleVenta) {
            return res.status(404).json({ error: "Sale detail not found" });
        }
        res.json(updatedDetalleVenta);
    } catch (err) {
        console.error("Error updating sale detail:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.eliminarDetalleVentaPorId = async (req, res) => {
    try {
        await DetalleVenta.eliminarDetalleVenta(req.params.id);
        res.status(204).send();
    } catch (err) {
        console.error("Error deleting sale detail:", err.message);
        res.status(500).json({ error: err.message });
    }
};
