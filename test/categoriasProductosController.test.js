const request = require('supertest');
const baseURL = 'https://api-mysql-duoc.onrender.com';
let token;

beforeAll(async () => {
    const response = await request(baseURL)
        .post('/auth/login')
        .send({
            email: 'pruebas@jest.cl',
            password: 'test123123!'
        });

    token = response.body.token;
});

describe('Categorias Productos API', () => {
    it('GET /categorias-productos should return all categories', async () => {
        const response = await request(baseURL)
            .get('/categorias-productos')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it('POST /categorias-productos should create a new category', async () => {
        const response = await request(baseURL)
            .post('/categorias-productos')
            .send({ nombre: 'New Category' })
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    });

    it('GET /categorias-productos/:id should return a category by ID', async () => {
        const response = await request(baseURL)
            .get('/categorias-productos/1')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', 1);
    });

    it('GET /categorias-productos/:id should return 404 for non-existing category', async () => {
        const response = await request(baseURL)
            .get('/categorias-productos/999')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Category not found');
    });

    it('PUT /categorias-productos/:id should update a category', async () => {
        const response = await request(baseURL)
            .put('/categorias-productos/1')
            .send({ nombre: 'Updated Category' })
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('nombre', 'Updated Category');
    });

    it('PUT /categorias-productos/:id should return 404 for non-existing category', async () => {
        const response = await request(baseURL)
            .put('/categorias-productos/999')
            .send({ nombre: 'Updated Category' })
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Category not found');
    });

    it('DELETE /categorias-productos/:id should delete a category', async () => {
        const response = await request(baseURL)
            .delete('/categorias-productos/1')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(204);
    });

    it('DELETE /categorias-productos/:id should return 404 for non-existing category', async () => {
        const response = await request(baseURL)
            .delete('/categorias-productos/999')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Category not found');
    });
});

describe('Usuarios API', () => {
    it('GET /usuarios should return all users', async () => {
        const response = await request(baseURL)
            .get('/usuarios')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
});
