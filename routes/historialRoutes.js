const express = require('express');
const router = express.Router();
const pool = require('../database');

// Obtener historial de compras de un usuario por su ID
router.get('/:usuario_id', async (req, res) => {
    const { usuario_id } = req.params;

    try {
        // Realizar consulta a la base de datos para obtener el historial de compras del usuario
        const historial = await pool.query('SELECT * FROM Ventas WHERE id_usuario = ?', [usuario_id]);

        // Verificar si se encontraron compras para el usuario
        if (historial.length === 0) {
            return res.status(404).json({ error: "Historial de compras no encontrado para el usuario especificado" });
        }

        // Devolver el historial de compras del usuario
        res.status(200).json(historial);
    } catch (error) {
        console.error("Error al obtener el historial de compras:", error);
        res.status(500).json({ error: "Ocurrió un error al obtener el historial de compras" });
    }
});

module.exports = router;
