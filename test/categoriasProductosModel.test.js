const CategoriasProductos = require('../models/CategoriasProductos');
const pool = require('../database');

jest.mock('../database');

describe('CategoriasProductos Model', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should get all categories', async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ id: 1, nombre: 'Category 1' }]
        });

        const categorias = await CategoriasProductos.getAll();
        expect(categorias).toBeInstanceOf(Array);
        expect(categorias.length).toBe(1);
        expect(categorias[0]).toHaveProperty('nombre', 'Category 1');
    });

    it('should get a category by ID', async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ id: 1, nombre: 'Category 1' }]
        });

        const categoria = await CategoriasProductos.getById(1);
        expect(categoria).toHaveProperty('id', 1);
    });

    it('should return undefined for non-existing category', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const categoria = await CategoriasProductos.getById(999);
        expect(categoria).toBeUndefined();
    });

    it('should create a new category', async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ id: 2, nombre: 'New Category' }]
        });

        const nuevaCategoria = await CategoriasProductos.create('New Category');
        expect(nuevaCategoria).toHaveProperty('id', 2);
    });

    it('should update a category', async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ id: 1, nombre: 'Updated Category' }]
        });

        const categoriaActualizada = await CategoriasProductos.update(1, 'Updated Category');
        expect(categoriaActualizada).toHaveProperty('nombre', 'Updated Category');
    });

    it('should delete a category', async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{ id: 1, nombre: 'Category to Delete' }]
        });

        const categoriaEliminada = await CategoriasProductos.delete(1);
        expect(categoriaEliminada).toHaveProperty('id', 1);
    });
});
