const { getAllLogs, getLogById } = require('../models/logModel');

// Obtener todos los logs
const getAllLogsController = async (req, res) => {
    try {
        console.log('Iniciando proceso para obtener todos los logs...');
        const logs = await getAllLogs();
        console.log('Logs obtenidos:', logs);
        res.status(200).json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ message: 'Error fetching logs', error: error.message });
    }
};

// Obtener log por ID
const getLogByIdController = async (req, res) => {
    try {
        console.log(`Iniciando proceso para obtener el log con ID: ${req.params.id}`);
        const log = await getLogById(req.params.id);
        console.log('Log obtenido:', log);
        res.status(200).json(log);
    } catch (error) {
        console.error('Error fetching log:', error);
        res.status(500).json({ message: 'Error fetching log', error: error.message });
    }
};

module.exports = {
    getAllLogsController,
    getLogByIdController
};
