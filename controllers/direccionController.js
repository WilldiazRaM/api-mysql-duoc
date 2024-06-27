const Direccion = require('../models/direccionModel');

exports.createDireccion = async (req, res) => {
    try {
        const newDireccion = await Direccion.createDireccion(req.body);
        res.status(201).json(newDireccion);
    } catch (err) {
        console.error("Error creating address:", err.message);
        res.status(400).json({ error: err.message });
    }
};

exports.getAllDirecciones = async (req, res) => {
    try {
        const direcciones = await Direccion.getAllDirecciones();
        res.json(direcciones);
    } catch (err) {
        console.error("Error fetching addresses:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.getDireccionById = async (req, res) => {
    try {
        const direccion = await Direccion.getDireccionById(req.params.id);
        if (!direccion) {
            return res.status(404).json({ error: "Address not found" });
        }
        res.json(direccion);
    } catch (err) {
        console.error("Error fetching address:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.updateDireccion = async (req, res) => {
    try {
        const updatedDireccion = await Direccion.updateDireccion(req.params.id, req.body);
        if (!updatedDireccion) {
            return res.status(404).json({ error: "Address not found" });
        }
        res.json(updatedDireccion);
    } catch (err) {
        console.error("Error updating address:", err.message);
        res.status(400).json({ error: err.message });
    }
};

exports.deleteDireccion = async (req, res) => {
    try {
        const deletedDireccion = await Direccion.deleteDireccion(req.params.id);
        if (!deletedDireccion) {
            return res.status(404).json({ error: "Address not found" });
        }
        res.status(204).send();
    } catch (err) {
        console.error("Error deleting address:", err.message);
        res.status(500).json({ error: err.message });
    }
};
