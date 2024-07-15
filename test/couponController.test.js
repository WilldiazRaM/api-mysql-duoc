const request = require('supertest');
const express = require('express');
const couponRoutes = require('../routes/couponRoutes'); 
const Coupon = require('../models/couponModel');


const app = express();
app.use(express.json());
app.use('/coupons', couponRoutes);r


jest.mock('../models/couponModel'); // Mockear el modelo

describe('Coupon Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpiar mocks antes de cada prueba
    });

    describe('POST /coupons', () => {
        it('should create a coupon successfully', async () => {
            const newCoupon = {
                codigo: 'DESC10',
                descuento: 10,
                fecha_expiracion: '2024-12-31',
                usos_restantes: 100
            };
            Coupon.createCoupon.mockResolvedValue(newCoupon); // Simular la respuesta del modelo

            const response = await request(app)
                .post('/coupons')
                .send(newCoupon);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Cupón creado correctamente');
            expect(response.body.coupon).toEqual(newCoupon);
        });

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/coupons')
                .send({ codigo: 'DESC10' }); // Solo enviando un campo

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Todos los campos son obligatorios');
        });
    });

    describe('GET /coupons', () => {
        it('should fetch all coupons', async () => {
            const coupons = [
                { id: 1, codigo: 'DESC10', descuento: 10 },
                { id: 2, codigo: 'DESC20', descuento: 20 }
            ];
            Coupon.getAllCoupons.mockResolvedValue(coupons);

            const response = await request(app).get('/coupons');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(coupons);
        });

        it('should return 500 on error', async () => {
            Coupon.getAllCoupons.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/coupons');

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Database error');
        });
    });

    describe('GET /coupons/:id', () => {
        it('should fetch a coupon by ID', async () => {
            const coupon = { id: 1, codigo: 'DESC10', descuento: 10 };
            Coupon.getCouponById.mockResolvedValue(coupon);

            const response = await request(app).get('/coupons/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(coupon);
        });

        it('should return 404 if coupon not found', async () => {
            Coupon.getCouponById.mockResolvedValue(null);

            const response = await request(app).get('/coupons/999');

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Cupón no encontrado');
        });

        it('should return 500 on error', async () => {
            Coupon.getCouponById.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/coupons/1');

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Database error');
        });
    });

    describe('PUT /coupons/:id', () => {
        it('should update a coupon successfully', async () => {
            const updatedCoupon = {
                codigo: 'DESC15',
                descuento: 15,
                fecha_expiracion: '2024-12-31',
                usos_restantes: 50
            };
            Coupon.updateCoupon.mockResolvedValue(updatedCoupon);

            const response = await request(app)
                .put('/coupons/1')
                .send(updatedCoupon);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Cupón actualizado correctamente');
            expect(response.body.coupon).toEqual(updatedCoupon);
        });

        it('should return 404 if coupon not found', async () => {
            Coupon.updateCoupon.mockResolvedValue(null);

            const response = await request(app)
                .put('/coupons/999')
                .send({ codigo: 'DESC15' });

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Cupón no encontrado');
        });

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .put('/coupons/1')
                .send({ codigo: 'DESC15' }); // Solo enviando un campo

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Todos los campos son obligatorios');
        });

        it('should return 500 on error', async () => {
            Coupon.updateCoupon.mockRejectedValue(new Error('Database error'));

            const response = await request(app).put('/coupons/1').send({
                codigo: 'DESC15',
                descuento: 15,
                fecha_expiracion: '2024-12-31',
                usos_restantes: 50
            });

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Database error');
        });
    });

    describe('DELETE /coupons/:id', () => {
        it('should delete a coupon successfully', async () => {
            const deletedCoupon = { id: 1, codigo: 'DESC10' };
            Coupon.deleteCoupon.mockResolvedValue(deletedCoupon);

            const response = await request(app).delete('/coupons/1');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Cupón eliminado correctamente');
        });

        it('should return 404 if coupon not found', async () => {
            Coupon.deleteCoupon.mockResolvedValue(null);

            const response = await request(app).delete('/coupons/999');

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Cupón no encontrado');
        });

        it('should return 500 on error', async () => {
            Coupon.deleteCoupon.mockRejectedValue(new Error('Database error'));

            const response = await request(app).delete('/coupons/1');

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Database error');
        });
    });
});


module.exports = app; 