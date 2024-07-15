const Venta = require('../models/ventasModel');
const pool = require('../database');
const { createLog } = require('../models/logModel');
const {
    crearVenta,
    obtenerTodasLasVentas,
    obtenerVenta,
    actualizarVentaPorId,
    eliminarVentaPorId,
} = require('../controllers/ventasController');

jest.mock('../models/ventasModel');
jest.mock('../models/logModel');
jest.mock('../database'); // Mockear el módulo de la base de datos

describe('Ventas Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpiar mocks antes de cada prueba
    });

    describe('crearVenta', () => {
        it('debería crear una venta y registrar un log', async () => {
            const req = { body: { id_usuario: 1, monto: 100 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            pool.query.mockResolvedValueOnce({ rowCount: 1 }); // Simula que el usuario existe
            Venta.createVenta.mockResolvedValueOnce({ id: 1 });

            await crearVenta(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ id: 1 });
            expect(createLog).toHaveBeenCalledWith('Venta', 'Nueva venta creada con ID: 1 por el usuario: 1');
        });

        it('debería devolver un error si el usuario no existe', async () => {
            const req = { body: { id_usuario: 999, monto: 100 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            pool.query.mockResolvedValueOnce({ rowCount: 0 }); // Simula que el usuario no existe

            await crearVenta(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'El id de usuario no existe' });
        });

        it('debería manejar errores internos', async () => {
            const req = { body: { id_usuario: 1, monto: 100 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            pool.query.mockResolvedValueOnce({ rowCount: 1 });
            Venta.createVenta.mockRejectedValueOnce(new Error('Error de base de datos'));

            await crearVenta(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error de base de datos' });
        });
    });

    describe('obtenerTodasLasVentas', () => {
        it('debería obtener todas las ventas', async () => {
            const req = {};
            const res = { json: jest.fn() };
            Venta.obtenerVentas.mockResolvedValueOnce([{ id: 1, monto: 100 }]);

            await obtenerTodasLasVentas(req, res);

            expect(res.json).toHaveBeenCalledWith([{ id: 1, monto: 100 }]);
        });

        it('debería manejar errores internos', async () => {
            const req = {};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            Venta.obtenerVentas.mockRejectedValueOnce(new Error('Error de base de datos'));

            await obtenerTodasLasVentas(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error de base de datos' });
        });
    });

    describe('obtenerVenta', () => {
        it('debería obtener una venta por ID', async () => {
            const req = { params: { id: 1 } };
            const res = { json: jest.fn() };
            Venta.obtenerVentaPorId.mockResolvedValueOnce({ id: 1, monto: 100 });

            await obtenerVenta(req, res);

            expect(res.json).toHaveBeenCalledWith({ id: 1, monto: 100 });
        });

        it('debería devolver un error si la venta no se encuentra', async () => {
            const req = { params: { id: 999 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            Venta.obtenerVentaPorId.mockResolvedValueOnce(null);

            await obtenerVenta(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Sale not found' });
        });

        it('debería manejar errores internos', async () => {
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            Venta.obtenerVentaPorId.mockRejectedValueOnce(new Error('Error de base de datos'));

            await obtenerVenta(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error de base de datos' });
        });
    });

    describe('actualizarVentaPorId', () => {
        it('debería actualizar una venta y registrar un log', async () => {
            const req = { params: { id: 1 }, body: { id_usuario: 1, monto: 150 } };
            const res = { json: jest.fn() };
            Venta.actualizarVenta.mockResolvedValueOnce({ id: 1, monto: 150 });

            await actualizarVentaPorId(req, res);

            expect(res.json).toHaveBeenCalledWith({ id: 1, monto: 150 });
            expect(createLog).toHaveBeenCalledWith('Venta', 'Venta con ID: 1 actualizada por el usuario: 1');
        });

        it('debería devolver un error si la venta no se encuentra', async () => {
            const req = { params: { id: 999 }, body: { id_usuario: 1, monto: 150 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            Venta.actualizarVenta.mockResolvedValueOnce(null);

            await actualizarVentaPorId(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Sale not found' });
        });

        it('debería manejar errores internos', async () => {
            const req = { params: { id: 1 }, body: { id_usuario: 1, monto: 150 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            Venta.actualizarVenta.mockRejectedValueOnce(new Error('Error de base de datos'));

            await actualizarVentaPorId(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error de base de datos' });
        });
    });

    describe('eliminarVentaPorId', () => {
        it('debería eliminar una venta y registrar un log', async () => {
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
            Venta.eliminarVenta.mockResolvedValueOnce();

            await eliminarVentaPorId(req, res);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(createLog).toHaveBeenCalledWith('Venta', 'Venta con ID: 1 eliminada');
        });

        it('debería manejar errores internos', async () => {
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            Venta.eliminarVenta.mockRejectedValueOnce(new Error('Error de base de datos'));

            await eliminarVentaPorId(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Error de base de datos' });
        });
    });
});
