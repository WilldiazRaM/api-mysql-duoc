const request = require('supertest');
const express = require('express');
const logController = require('../controllers/logController');
const LogModel = require('../models/logModel');

jest.mock('../models/logModel'); // Mockear el modelo

const app = express();
app.use(express.json()); // Middleware para parsear JSON
app.get('/logs', logController.getAllLogsController);
app.get('/logs/:id', logController.getLogByIdController);

describe('Log Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpiar mocks antes de cada prueba
    });

    describe('getAllLogsController', () => {
        it('should fetch all logs successfully', async () => {
            LogModel.getAllLogs.mockResolvedValue([{ id: 1, tipo: 'info', descripcion: 'Log de prueba' }]);

            const response = await request(app).get('/logs');

            expect(response.status).toBe(200);
            expect(response.body).toEqual([{ id: 1, tipo: 'info', descripcion: 'Log de prueba' }]);
        });

        it('should return 500 if an error occurs', async () => {
            LogModel.getAllLogs.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/logs');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Error fetching logs', error: 'Database error' });
        });
    });

    describe('getLogByIdController', () => {
        it('should fetch log by ID successfully', async () => {
            LogModel.getLogById.mockResolvedValue({ id: 1, tipo: 'info', descripcion: 'Log de prueba' });

            const response = await request(app).get('/logs/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ id: 1, tipo: 'info', descripcion: 'Log de prueba' });
        });

        it('should return 500 if log not found', async () => {
            LogModel.getLogById.mockRejectedValue(new Error('Log no encontrado'));

            const response = await request(app).get('/logs/999');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Error fetching log', error: 'Log no encontrado' });
        });

        it('should return 500 if an error occurs', async () => {
            LogModel.getLogById.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/logs/1');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Error fetching log', error: 'Database error' });
        });
    });
});
