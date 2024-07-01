require('dotenv').config({ path: './.env.test' });
const request = require('supertest');
const app = require('../server.js'); // Importa app desde server.js

describe('Auth API', () => {
    describe('POST /auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({
                    username: 'testuser',
                    password: 'Test@1234',
                    email: 'testuser@example.com',
                    role: 'user'
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('message', 'Usuario registrado exitosamente');
        });
    });

    describe('POST /auth/login', () => {
        it('should login an existing user', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: 'testuser@example.com',
                    password: 'Test@1234'
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
        });
    });
});
