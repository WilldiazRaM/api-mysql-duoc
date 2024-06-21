const { getAllPagos, getPagoById } = require('../models/pagoModel');
const { generateBuyOrder, generateSessionId } = require('../utils/pagosUtils');

const obtenerPagos = async (req, res) => {
    try {
        const pagos = await getAllPagos();
        res.status(200).json(pagos);
    } catch (error) {
        console.error("Error al obtener los pagos:", error);
        res.status(500).json({ error: "Ocurrió un error al obtener los pagos" });
    }
};

const obtenerPagoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const pago = await getPagoById(id);
        res.status(200).json(pago);
    } catch (error) {
        console.error("Error al obtener el pago:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    obtenerPagos,
    obtenerPagoPorId
};
