const Direccion = require('../models/direccionModel');

exports.createDireccion = async (req, res) => {
    try {
        const newDireccion = await Direccion.createDireccion(req.body);
        res.status(201).json({
            message: 'Dirección agregada correctamente',
            direccion: newDireccion
        });
    } catch (err) {
        console.error("Error creating address:", err.message);
        res.status(400).json({ error: 'Error al agregar la dirección: ' + err.message });
    }
};

exports.getAllDirecciones = async (req, res) => {
    try {
        const direcciones = await Direccion.getAllDirecciones();
        res.json(direcciones);
    } catch (err) {
        console.error("Error fetching addresses:", err.message);
        res.status(500).json({ error: 'Error al obtener las direcciones: ' + err.message });
    }
};

exports.getDireccionById = async (req, res) => {
    try {
        const direccion = await Direccion.getDireccionById(req.params.id);
        if (!direccion) {
            return res.status(404).json({ error: "Dirección no encontrada" });
        }
        res.json(direccion);
    } catch (err) {
        console.error("Error fetching address:", err.message);
        res.status(500).json({ error: 'Error al obtener la dirección: ' + err.message });
    }
};

exports.updateDireccion = async (req, res) => {
    try {
        const updatedDireccion = await Direccion.updateDireccion(req.params.id, req.body);
        if (!updatedDireccion) {
            return res.status(404).json({ error: "Dirección no encontrada" });
        }
        res.json({
            message: 'Dirección actualizada correctamente',
            direccion: updatedDireccion
        });
    } catch (err) {
        console.error("Error updating address:", err.message);
        res.status(400).json({ error: 'Error al actualizar la dirección: ' + err.message });
    }
};

exports.deleteDireccion = async (req, res) => {
    try {
        const deletedDireccion = await Direccion.deleteDireccion(req.params.id);
        if (!deletedDireccion) {
            return res.status(404).json({ error: "Dirección no encontrada" });
        }
        res.status(204).json({ message: 'Dirección eliminada correctamente' });
    } catch (err) {
        console.error("Error deleting address:", err.message);
        res.status(500).json({ error: 'Error al eliminar la dirección: ' + err.message });
    }
};
