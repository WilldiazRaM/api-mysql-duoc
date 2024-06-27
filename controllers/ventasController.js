const Venta = require('../models/ventasModel');
const pool = require('../database');
const { createLog } = require('../models/logModel'); // Asegúrate de importar la función createLog

exports.crearVenta = async (req, res) => {
    try {
        const { id_usuario, monto } = req.body;
        
        // Verificar si el usuario existe
        const usuarioExiste = await pool.query('SELECT 1 FROM "Usuarios" WHERE id = $1', [id_usuario]);
        if (usuarioExiste.rowCount === 0) {
            return res.status(400).json({ error: 'El id de usuario no existe' });
        }
        
        const newVenta = await Venta.createVenta(id_usuario, monto);

        // Crear un log para la nueva venta
        await createLog('Venta', `Nueva venta creada con ID: ${newVenta.id} por el usuario: ${id_usuario}`);
        
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

        // Crear un log para la actualización de la venta
        await createLog('Venta', `Venta con ID: ${req.params.id} actualizada por el usuario: ${id_usuario}`);

        res.json(updatedVenta);
    } catch (err) {
        console.error("Error updating sale:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.eliminarVentaPorId = async (req, res) => {
    try {
        await Venta.eliminarVenta(req.params.id);

        // Crear un log para la eliminación de la venta
        await createLog('Venta', `Venta con ID: ${req.params.id} eliminada`);

        res.status(204).send();
    } catch (err) {
        console.error("Error deleting sale:", err.message);
        res.status(500).json({ error: err.message });
    }
};
