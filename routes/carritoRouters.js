const pool = require('../database');
const express = require('express');
const router = express.Router();


//Agregar producto al carrtito:
router.post('/carrito', async (req, res) => {
    const { id_producto, cantidad, id_usuario } = req.body;

    try {
        // Verificar si el producto existe y hay suficiente cantidad en stock
        const producto = await pool.query('SELECT * FROM Productos WHERE id = ?', [id_producto]);
        
        if (producto.length === 0 || producto[0].stock < cantidad) {
            return res.status(400).json({ error: "Producto no disponible o cantidad insuficiente en stock" });
        }

        // Insertar el producto en el carrito
        await pool.query('INSERT INTO DetalleVenta (id_producto, cantidad, id_usuario) VALUES (?, ?, ?)', [id_producto, cantidad, id_usuario]);

        res.status(201).json({ message: "Producto agregado al carrito correctamente" });
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).json({ error: "Ocurrió un error al agregar el producto al carrito" });
    }
});

//Obtener contenido carrito del usuario:
router.get('/carrito/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;

    try {
        const carrito = await pool.query('SELECT * FROM DetalleVenta WHERE id_usuario = ?', [id_usuario]);
        
        res.status(200).json(carrito);
    } catch (error) {
        console.error("Error al obtener contenido del carrito:", error);
        res.status(500).json({ error: "Ocurrió un error al obtener el contenido del carrito" });
    }
});


//Actualizar contenido del carrito del usuario:
router.put('/carrito/:id_detalle', async (req, res) => {
    const { id_detalle } = req.params;
    const { cantidad } = req.body;

    try {
        await pool.query('UPDATE DetalleVenta SET cantidad = ? WHERE id = ?', [cantidad, id_detalle]);
        
        res.status(200).json({ message: "Cantidad de producto en el carrito actualizada correctamente" });
    } catch (error) {
        console.error("Error al actualizar cantidad de producto en el carrito:", error);
        res.status(500).json({ error: "Ocurrió un error al actualizar la cantidad de producto en el carrito" });
    }
});

//ELIMINAR un producto del carrito del usuario:
router.delete('/carrito/:id_detalle', async (req, res) => {
    const { id_detalle } = req.params;

    try {
        await pool.query('DELETE FROM DetalleVenta WHERE id = ?', [id_detalle]);
        
        res.status(200).json({ message: "Producto eliminado del carrito correctamente" });
    } catch (error) {
        console.error("Error al eliminar producto del carrito:", error);
        res.status(500).json({ error: "Ocurrió un error al eliminar el producto del carrito" });
    }
});

module.exports = router;