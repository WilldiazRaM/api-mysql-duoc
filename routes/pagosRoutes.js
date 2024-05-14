const pool = require('../database');
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { generateBuyOrder, generateSessionId, obtenerPagos, getPagoById } = require('../utils/pagosUtils');

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



// Ruta para obtener un pago por su ID
router.get('/pagos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Llamar a la función para obtener el pago por su ID
        const pago = await getPagoById(id);
        
        // Si se encontró el pago, devolverlo como respuesta
        res.status(200).json(pago);
    } catch (error) {
        console.error("Error al obtener el pago:", error);
        // Si ocurre algún error, devolver un estado 500 con el mensaje de error
        res.status(500).json({ error: error.message });
    }
});


// Actualizar un pago por su ID
router.put('/pagos/:id', async (req, res) => {
    const { id } = req.params;
    const { id_usuario, monto } = req.body;

    try {
        // Verificar si el pago existe antes de intentar actualizarlo
        const pagoExistente = await getPagoById(id);
        if (!pagoExistente) {
            return res.status(404).json({ error: "Pago no encontrado" });
        }

        // Actualizar el pago en la base de datos
        await pool.query('UPDATE Ventas SET id_usuario = ?, monto = ? WHERE id = ?', [id_usuario, monto, id]);
        
        // Obtener el pago actualizado
        const pagoActualizado = await getPagoById(id);
        
        // Devolver el pago actualizado como respuesta
        res.status(200).json(pagoActualizado);
    } catch (error) {
        console.error("Error al actualizar el pago:", error);
        res.status(500).json({ error: "Ocurrió un error al actualizar el pago" });
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
