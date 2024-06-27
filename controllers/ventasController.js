const Venta = require('../models/ventasModel');

exports.crearVenta = async (req, res) => {
    try {
        const { id_usuario, monto } = req.body;
        const newVenta = await Venta.createVenta(id_usuario, monto);
        res.status(201).json(newVenta);
    } catch (err) {
        console.error("Error creating sale:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.obtenerTodasLasVentas = async (req, res) => {
    try {
        const ventas = await Venta.obtenerVentas();
        res.json(ventas);
    } catch (err) {
        console.error("Error fetching sales:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.obtenerVenta = async (req, res) => {
    try {
        const venta = await Venta.obtenerVentaPorId(req.params.id);
        if (!venta) {
            return res.status(404).json({ error: "Sale not found" });
        }
        res.json(venta);
    } catch (err) {
        console.error("Error fetching sale:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.actualizarVentaPorId = async (req, res) => {
    try {
        const { id_usuario, monto } = req.body;
        const updatedVenta = await Venta.actualizarVenta(req.params.id, id_usuario, monto);
        if (!updatedVenta) {
            return res.status(404).json({ error: "Sale not found" });
        }
        res.json(updatedVenta);
    } catch (err) {
        console.error("Error updating sale:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.eliminarVentaPorId = async (req, res) => {
    try {
        await Venta.eliminarVenta(req.params.id);
        res.status(204).send();
    } catch (err) {
        console.error("Error deleting sale:", err.message);
        res.status(500).json({ error: err.message });
    }
};
