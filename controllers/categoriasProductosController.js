const CategoriasProductos = require('../models/CategoriasProductos');

exports.getAllCategorias = async (req, res) => {
    try {
        const categorias = await CategoriasProductos.getAll();
        res.json(categorias);
    } catch (err) {
        console.error("Error fetching categories:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.getCategoriaById = async (req, res) => {
    try {
        const categoria = await CategoriasProductos.getById(req.params.id);
        if (!categoria) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json(categoria);
    } catch (err) {
        console.error("Error fetching category by ID:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.createCategoria = async (req, res) => {
    try {
        const { nombre } = req.body;
        const newCategoria = await CategoriasProductos.create(nombre);
        res.status(201).json(newCategoria);
    } catch (err) {
        console.error("Error creating category:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.updateCategoria = async (req, res) => {
    try {
        const { nombre } = req.body;
        const updatedCategoria = await CategoriasProductos.update(req.params.id, nombre);
        if (!updatedCategoria) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json(updatedCategoria);
    } catch (err) {
        console.error("Error updating category:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCategoria = async (req, res) => {
    try {
        const categoria = await CategoriasProductos.delete(req.params.id);
        if (!categoria) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.status(204).send();
    } catch (err) {
        console.error("Error deleting category:", err.message);
        res.status(500).json({ error: err.message });
    }
};
