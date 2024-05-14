const pool = require('../database');
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { generateBuyOrder, generateSessionId, obtenerPagos } = require('../utils/pagosUtils');

//Crear un pago TRANSBANk
router.post('/pagos', async (req, res) => {
    const { id_usuario, monto } = req.body;
    const { Tbk_Api_Key_Id = 597055555532, 
        Tbk_Api_Key_Secret = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C'  } = req.headers;

    try {
        // Llamar a la API de Transbank para crear la transacción
        const transbankResponse = await axios.post(
            'https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions',
            {
                buy_order: generateBuyOrder(), // Generar un número de orden de compra único
                session_id: generateSessionId(), // Generar un ID de sesión único
                amount: monto,
                return_url: "http://www.comercio.cl/webpay/retorno"
            },
            {
                headers: {
                    'Tbk-Api-Key-Id': Tbk_Api_Key_Id,
                    'Tbk-Api-Key-Secret': Tbk_Api_Key_Secret,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Guardar la información de la transacción en la tabla Ventas
        await pool.query('INSERT INTO Ventas (id_usuario, monto) VALUES (?, ?)', [id_usuario, monto]);

        // Devolver la respuesta de Transbank al cliente
        res.status(200).json(transbankResponse.data);
    } catch (error) {
        console.error("Error al procesar el pago:", error);
        res.status(500).json({ error: "Ocurrió un error al procesar el pago" });
    }
});


//Obtener todo los pagos:
router.get('/pagos', async (req, res) => {
    try {
        const pagos = await obtenerPagos();
        res.status(200).json(pagos);
    } catch (error) {
        console.error("Error al obtener los pagos:", error);
        res.status(500).json({ error: "Ocurrió un error al obtener los pagos" });
    }
});



router.get('/pagos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const pago = await pool.query('SELECT * FROM Ventas WHERE id = ?', [id]);
        if (pago.length === 0) {
            return res.status(404).json({ error: "Pago no encontrado" });
        }
        res.status(200).json(pago[0]);
    } catch (error) {
        console.error("Error al obtener el pago:", error);
        res.status(500).json({ error: "Ocurrió un error al obtener el pago" });
    }
});


// Eliminar pagos por id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        
        await pool.query('DELETE FROM Pagos WHERE id = ?', [id]);

        
        res.status(200).json({ message: 'El pago ha sido eliminado exitosamente.' });
    } catch (error) {
        console.error("Error al eliminar el pago:", error);
        // devolvemos un mensaje de error
        res.status(500).json({ error: "Ocurrió un error al eliminar el pago" });
    }
});

module.exports = router;
