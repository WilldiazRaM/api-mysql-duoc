const { getAllLogs, getLogById } = require('../models/logModel');

// Obtener todos los logs
const getAllLogsController = async (req, res) => {
    try {
        const logs = await getAllLogs();
        res.status(200).json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ message: 'Error fetching logs', error: error.message });
    }
};

// Obtener log por ID
const getLogByIdController = async (req, res) => {
    try {
        const log = await getLogById(req.params.id);
        if (!log) {
            return res.status(404).json({ message: 'Log no encontrado' });
        }
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
