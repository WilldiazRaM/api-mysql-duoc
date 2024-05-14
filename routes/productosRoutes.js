const pool = require('../database');
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../utils/passwordUtils');
const { createProducto } = require('../utils/productoUtils');

router.post('/', requireAuth, async (req, res) => {
    const { nombre, precio, descripcion, stock, categoria_nombre } = req.body;

    try {
        const nuevoProducto = await createProducto(nombre, precio, descripcion, stock, categoria_nombre);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(500).json({ error: "Ocurrió un error al crear el producto" });
    }
});





module.exports = router;
