const pool = require('../database');
const LogModel = require('../models/logModel');

jest.mock('../database'); 

describe('Log Model', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpiar mocks antes de cada prueba
    });

    describe('createLog', () => {
        it('should create a log successfully', async () => {
            const mockLog = { id: 1, tipo: 'info', descripcion: 'Log de prueba' };
            pool.query.mockResolvedValueOnce({ rows: [mockLog] });

            const log = await LogModel.createLog('info', 'Log de prueba');

            expect(log).toEqual(mockLog);
            expect(pool.query).toHaveBeenCalledWith(
                expect.any(String),
                ['info', 'Log de prueba']
            );
        });

        it('should throw an error if the database operation fails', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(LogModel.createLog('info', 'Log de prueba')).rejects.toThrow('Database error');
        });
    });

    describe('getAllLogs', () => {
        it('should fetch all logs successfully', async () => {
            const mockLogs = [{ id: 1, tipo: 'info', descripcion: 'Log de prueba' }];
            pool.query.mockResolvedValueOnce({ rows: mockLogs });

            const logs = await LogModel.getAllLogs();

            expect(logs).toEqual(mockLogs);
            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM "Logs"');
        });

        it('should throw an error if the database operation fails', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(LogModel.getAllLogs()).rejects.toThrow('Database error');
        });
    });

    describe('getLogById', () => {
        it('should fetch a log by ID successfully', async () => {
            const mockLog = { id: 1, tipo: 'info', descripcion: 'Log de prueba' };
            pool.query.mockResolvedValueOnce({ rows: [mockLog], rowCount: 1 });

            const log = await LogModel.getLogById(1);

            expect(log).toEqual(mockLog);
            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM "Logs" WHERE id = $1', [1]);
        });

        it('should throw an error if log not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

            await expect(LogModel.getLogById(999)).rejects.toThrow('Log no encontrado');
        });

        it('should throw an error if the database operation fails', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            await expect(LogModel.getLogById(1)).rejects.toThrow('Database error');
        });
    });
});
