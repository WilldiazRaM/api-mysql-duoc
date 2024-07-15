const request = require('supertest');
const express = require('express');
const carritoController = require('../controllers/carritoController');
const pool = require('../database');

jest.mock('../database');

const app = express();
app.use(express.json());
app.post('/carrito', carritoController.addProductToCart);
app.get('/carrito/:id_usuario', carritoController.getUserCart);
app.put('/carrito/:id_detalle', carritoController.updateCartProduct);
app.delete('/carrito/:id_detalle', carritoController.deleteCartProduct);

describe('Carrito Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {}); // Silenciar mensajes de error
    });

    describe('addProductToCart', () => {
        it('should add product to cart successfully', async () => {
            pool.query
                .mockResolvedValueOnce({ rowCount: 1, rows: [{ stock: 10 }] }) // Producto existe y stock suficiente
                .mockResolvedValueOnce({});

            const response = await request(app)
                .post('/carrito')
                .send({ id_producto: 1, cantidad: 2, id_usuario: 1 });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', "Producto agregado al carrito correctamente");
        });

        it('should return 400 if product does not exist', async () => {
            pool.query.mockResolvedValueOnce({ rowCount: 0 });

            const response = await request(app)
                .post('/carrito')
                .send({ id_producto: 999, cantidad: 2, id_usuario: 1 });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', "Producto no disponible o cantidad insuficiente en stock");
        });

        it('should return 400 if insufficient stock', async () => {
            pool.query
                .mockResolvedValueOnce({ rowCount: 1, rows: [{ stock: 1 }] });

            const response = await request(app)
                .post('/carrito')
                .send({ id_producto: 1, cantidad: 2, id_usuario: 1 });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', "Producto no disponible o cantidad insuficiente en stock");
        });
    });

    describe('getUserCart', () => {
        it('should return the user cart', async () => {
            pool.query.mockResolvedValueOnce({
                rows: [{ id: 1, id_producto: 1, cantidad: 2 }]
            });

            const response = await request(app)
                .get('/carrito/1');

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(1);
        });

        it('should return 500 on database error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const response = await request(app)
                .get('/carrito/1');

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', "Ocurrió un error al obtener el contenido del carrito");
        });
    });

    describe('updateCartProduct', () => {
        it('should update the cart product quantity', async () => {
            pool.query.mockResolvedValueOnce({});

            const response = await request(app)
                .put('/carrito/1')
                .send({ cantidad: 3 });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', "Cantidad de producto en el carrito actualizada correctamente");
        });

        it('should return 500 on database error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const response = await request(app)
                .put('/carrito/1')
                .send({ cantidad: 3 });

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', "Ocurrió un error al actualizar la cantidad de producto en el carrito");
        });
    });

    describe('deleteCartProduct', () => {
        it('should delete the product from the cart', async () => {
            pool.query.mockResolvedValueOnce({});

            const response = await request(app)
                .delete('/carrito/1');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', "Producto eliminado del carrito correctamente");
        });

        it('should return 500 on database error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Database error'));

            const response = await request(app)
                .delete('/carrito/1');

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', "Ocurrió un error al eliminar el producto del carrito");
        });
    });
});
