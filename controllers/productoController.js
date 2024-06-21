const { createProducto, obtenerProductos, obtenerProductoPorId } = require('../models/productoModel');

const crearProducto = async (req, res) => {
    const { nombre, precio, descripcion, stock, categoria_nombre } = req.body;

    try {
        const nuevoProducto = await createProducto(nombre, precio, descripcion, stock, categoria_nombre);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(500).json({ error: "Ocurrió un error al crear el producto" });
    }
};

const obtenerTodosLosProductos = async (req, res) => {
    try {
        const productos = await obtenerProductos();
        res.status(200).json(productos);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Ocurrió un error al obtener los productos" });
    }
};

const obtenerProducto = async (req, res) => {
    const { id } = req.params;

    try {
        const producto = await obtenerProductoPorId(id);
        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(producto);
    } catch (error) {
        console.error("Error al obtener producto por ID:", error);
        res.status(500).json({ error: "Ocurrió un error al obtener el producto" });
    }
};

const actualizarProductoPorId = async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, descripcion, stock, categoria_nombre } = req.body;

    try {
        const productoActualizado = await actualizarProducto(id, nombre, precio, descripcion, stock, categoria_nombre);
        res.json({ message: "Producto actualizado correctamente", productoActualizado });
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ error: "Ocurrió un error al actualizar el producto" });
    }
};

const eliminarProductoPorId = async (req, res) => {
    const { id } = req.params;

    try {
        await eliminarProducto(id);
        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ error: "Ocurrió un error al eliminar el producto" });
    }
};

module.exports = {
    crearProducto,
    obtenerTodosLosProductos,
    obtenerProducto,
    actualizarProductoPorId,
    eliminarProductoPorId
};
