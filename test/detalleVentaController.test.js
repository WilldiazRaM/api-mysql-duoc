const request = require('supertest');
const express = require('express');
const detalleVentaController = require('../controllers/detalleVentaController');
const DetalleVenta = require('../models/detalleVentaModel');

jest.mock('../models/detalleVentaModel'); // Mockear el modelo

const app = express();
app.use(express.json()); // Middleware para parsear JSON
app.post('/detalles-venta', detalleVentaController.crearDetalleVenta);
app.get('/detalles-venta', detalleVentaController.obtenerTodosLosDetallesVenta);
app.get('/detalles-venta/:id', detalleVentaController.obtenerDetalleVenta);
app.put('/detalles-venta/:id', detalleVentaController.actualizarDetalleVentaPorId);
app.delete('/detalles-venta/:id', detalleVentaController.eliminarDetalleVentaPorId);

describe('DetalleVenta Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpiar mocks antes de cada prueba
    });

    describe('crearDetalleVenta', () => {
        it('should create a sale detail successfully', async () => {
            DetalleVenta.createDetalleVenta.mockResolvedValue({ id: 1, id_venta: 1, id_producto: 1, id_usuario: 1, cantidad: 2, precio_unitario: 100 });

            const response = await request(app)
                .post('/detalles-venta')
                .send({ id_venta: 1, id_producto: 1, id_usuario: 1, cantidad: 2, precio_unitario: 100 });

            expect(response.status).toBe(201);
            expect(response.body).toEqual({ id: 1, id_venta: 1, id_producto: 1, id_usuario: 1, cantidad: 2, precio_unitario: 100 });
        });

        it('should return 500 if an error occurs', async () => {
            DetalleVenta.createDetalleVenta.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post('/detalles-venta')
                .send({ id_venta: 1, id_producto: 1, id_usuario: 1, cantidad: 2, precio_unitario: 100 });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });

    describe('obtenerTodosLosDetallesVenta', () => {
        it('should fetch all sale details successfully', async () => {
            DetalleVenta.obtenerDetallesVenta.mockResolvedValue([{ id: 1, id_venta: 1, id_producto: 1 }]);

            const response = await request(app).get('/detalles-venta');

            expect(response.status).toBe(200);
            expect(response.body).toEqual([{ id: 1, id_venta: 1, id_producto: 1 }]);
        });

        it('should return 500 if an error occurs', async () => {
            DetalleVenta.obtenerDetallesVenta.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/detalles-venta');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });

    describe('obtenerDetalleVenta', () => {
        it('should fetch sale detail by ID successfully', async () => {
            DetalleVenta.obtenerDetalleVentaPorId.mockResolvedValue({ id: 1, id_venta: 1, id_producto: 1 });

            const response = await request(app).get('/detalles-venta/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ id: 1, id_venta: 1, id_producto: 1 });
        });

        it('should return 404 if sale detail does not exist', async () => {
            DetalleVenta.obtenerDetalleVentaPorId.mockResolvedValue(undefined);

            const response = await request(app).get('/detalles-venta/999');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Sale detail not found' });
        });

        it('should return 500 if an error occurs', async () => {
            DetalleVenta.obtenerDetalleVentaPorId.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/detalles-venta/1');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });

    describe('actualizarDetalleVentaPorId', () => {
        it('should update a sale detail successfully', async () => {
            DetalleVenta.actualizarDetalleVenta.mockResolvedValue({ id: 1, id_venta: 1, id_producto: 1 });

            const response = await request(app)
                .put('/detalles-venta/1')
                .send({ id_venta: 1, id_producto: 1, id_usuario: 1, cantidad: 2, precio_unitario: 100 });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ id: 1, id_venta: 1, id_producto: 1 });
        });

        it('should return 404 if sale detail does not exist', async () => {
            DetalleVenta.actualizarDetalleVenta.mockResolvedValue(undefined);

            const response = await request(app)
                .put('/detalles-venta/999')
                .send({ id_venta: 1, id_producto: 1, id_usuario: 1, cantidad: 2, precio_unitario: 100 });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Sale detail not found' });
        });

        it('should return 500 if an error occurs', async () => {
            DetalleVenta.actualizarDetalleVenta.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .put('/detalles-venta/1')
                .send({ id_venta: 1, id_producto: 1, id_usuario: 1, cantidad: 2, precio_unitario: 100 });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });

    describe('eliminarDetalleVentaPorId', () => {
        it('should delete a sale detail successfully', async () => {
            DetalleVenta.eliminarDetalleVenta.mockResolvedValue();

            const response = await request(app).delete('/detalles-venta/1');

            expect(response.status).toBe(204);
        });

        it('should return 500 if an error occurs', async () => {
            DetalleVenta.eliminarDetalleVenta.mockRejectedValue(new Error('Database error'));

            const response = await request(app).delete('/detalles-venta/1');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });
});
