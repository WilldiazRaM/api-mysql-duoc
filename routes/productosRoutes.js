const pool = require('../database');
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../utils/passwordUtils');
const { createProducto } = require('../utils/productoUtils');


//Crear un producto
router.post('/', async (req, res) => {
    const { nombre, precio, descripcion, stock, categoria_nombre } = req.body;

    try {
        const nuevoProducto = await createProducto(nombre, precio, descripcion, stock, categoria_nombre);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(500).json({ error: "Ocurrió un error al crear el producto" });
    }
});


router.get('/', async (req, res) => {
    try {
        const productosResult = await pool.query('SELECT * FROM Productos');
        const productos = productosResult.map(producto => ({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            descripcion: producto.descripcion,
            stock: producto.stock,
            categoria_id: producto.categoria_id
        }));
        res.status(200).json(productos);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Ocurrió un error al obtener los productos" });
    }
});



// Obtener un producto por su ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const producto = await pool.query('SELECT * FROM Productos WHERE id = ?', [id]);
        if (producto.length === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(producto[0]);
    } catch (error) {
        console.error("Error al obtener producto por ID:", error);
        res.status(500).json({ error: "Ocurrió un error al obtener el producto" });
    }
});

// Actualizar un producto por su ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, descripcion, stock, categoria_nombre } = req.body;

    try {
        await pool.query('UPDATE Productos SET nombre = ?, precio = ?, descripcion = ?, stock = ?, categoria_nombre = ? WHERE id = ?', 
            [nombre, precio, descripcion, stock, categoria_nombre, id]);
        res.json({ message: "Producto actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ error: "Ocurrió un error al actualizar el producto" });
    }
});

// Eliminar un producto por su ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM Productos WHERE id = ?', [id]);
        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ error: "Ocurrió un error al eliminar el producto" });
    }
});


module.exports = router;
