const Producto = require('../models/productoModel');

exports.crearProducto = async (req, res) => {
    try {
        const { nombre, precio, descripcion, stock, categoria_nombre } = req.body;
        const newProducto = await Producto.createProducto(nombre, precio, descripcion, stock, categoria_nombre);
        res.status(201).json(newProducto);
    } catch (err) {
        console.error("Error creating product:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.obtenerTodosLosProductos = async (req, res) => {
    try {
        const productos = await Producto.obtenerProductos();
        res.json(productos);
    } catch (err) {
        console.error("Error fetching products:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.obtenerProducto = async (req, res) => {
    try {
        const producto = await Producto.obtenerProductoPorId(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(producto);
    } catch (err) {
        console.error("Error fetching product:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.actualizarProductoPorId = async (req, res) => {
    try {
        const { nombre, precio, descripcion, stock, categoria_nombre } = req.body;
        const updatedProducto = await Producto.actualizarProducto(req.params.id, nombre, precio, descripcion, stock, categoria_nombre);
        if (!updatedProducto) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(updatedProducto);
    } catch (err) {
        console.error("Error updating product:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.eliminarProductoPorId = async (req, res) => {
    try {
        await Producto.eliminarProducto(req.params.id);
        res.status(204).send();
    } catch (err) {
        console.error("Error deleting product:", err.message);
        res.status(500).json({ error: err.message });
    }
};
