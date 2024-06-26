const CategoriasProductos = require('../models/CategoriasProductos');

exports.getAllCategorias = async (req, res) => {
    try {
        const categorias = await CategoriasProductos.getAll();
        res.json(categorias);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCategoriaById = async (req, res) => {
    try {
        const categoria = await CategoriasProductos.getById(req.params.id);
        res.json(categoria);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createCategoria = async (req, res) => {
    try {
        const { nombre } = req.body;
        const newCategoria = await CategoriasProductos.create(nombre);
        res.status(201).json(newCategoria);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCategoria = async (req, res) => {
    try {
        const { nombre } = req.body;
        const updatedCategoria = await CategoriasProductos.update(req.params.id, nombre);
        res.json(updatedCategoria);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCategoria = async (req, res) => {
    try {
        await CategoriasProductos.delete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
