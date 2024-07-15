const request = require('supertest');
const express = require('express');
const wishlistController = require('../controllers/wishlistController');
const pool = require('../database');

jest.mock('../database');

const app = express();
app.use(express.json());
app.use('/wishlist', wishlistController);

describe('Wishlist Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /wishlist', () => {
        it('should create a wishlist successfully', async () => {
            pool.query
                .mockResolvedValueOnce({ rowCount: 1 })
                .mockResolvedValueOnce({ rowCount: 1 })
                .mockResolvedValueOnce({ rows: [{ id: 1 }] });

            const response = await request(app)
                .post('/wishlist')
                .send({ id_usuario: 1, id_producto: 1 });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Producto agregado a la wishlist correctamente');
        });

        it('should return 400 if user or product is missing', async () => {
            const response = await request(app)
                .post('/wishlist')
                .send({ id_usuario: 1 });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Usuario y Producto son obligatorios');
        });
    });

    describe('GET /wishlist', () => {
        it('should return all wishlists', async () => {
            pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }, { id: 2 }] });

            const response = await request(app).get('/wishlist');

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
        });
    });

    describe('GET /wishlist/:id', () => {
        it('should return a wishlist by ID', async () => {
            pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

            const response = await request(app).get('/wishlist/1');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', 1);
        });

        it('should return 404 if wishlist not found', async () => {
            pool.query.mockResolvedValueOnce({ rowCount: 0 });

            const response = await request(app).get('/wishlist/999');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', "Wishlist no encontrada");
        });
    });

    describe('PUT /wishlist/:id', () => {
        it('should update a wishlist successfully', async () => {
            pool.query
                .mockResolvedValueOnce({ rowCount: 1 })
                .mockResolvedValueOnce({ rowCount: 1 })
                .mockResolvedValueOnce({ rows: [{ id: 1 }] });

            const response = await request(app)
                .put('/wishlist/1')
                .send({ id_usuario: 1, id_producto: 1 });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Wishlist actualizada correctamente');
        });

        it('should return 404 if wishlist not found', async () => {
            pool.query
                .mockResolvedValueOnce({ rowCount: 1 })
                .mockResolvedValueOnce({ rowCount: 1 })
                .mockResolvedValueOnce({ rowCount: 0 });

            const response = await request(app)
                .put('/wishlist/999')
                .send({ id_usuario: 1, id_producto: 1 });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', "Wishlist no encontrada");
        });

        it('should return 400 if user or product is missing', async () => {
            const response = await request(app)
                .put('/wishlist/1')
                .send({ id_usuario: 1 });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Usuario y Producto son obligatorios');
        });
    });

    describe('DELETE /wishlist/:id', () => {
        it('should delete a wishlist successfully', async () => {
            pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

            const response = await request(app).delete('/wishlist/1');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Wishlist eliminada correctamente');
        });

        it('should return 404 if wishlist not found', async () => {
            pool.query.mockResolvedValueOnce({ rowCount: 0 });

            const response = await request(app).delete('/wishlist/999');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', "Wishlist no encontrada");
        });
    });
});
