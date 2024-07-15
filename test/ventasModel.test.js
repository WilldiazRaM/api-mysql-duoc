const pool = require('../database');
const {
    createVenta,
    obtenerVentas,
    obtenerVentaPorId,
    actualizarVenta,
    eliminarVenta,
} = require('../models/ventasModel');

jest.mock('../database'); // Mockear el módulo de la base de datos

describe('Ventas Model', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpiar mocks antes de cada prueba
    });

    describe('createVenta', () => {
        it('debería crear una nueva venta', async () => {
            const mockVenta = { id: 1, id_usuario: 1, monto: 100 };
            pool.query.mockResolvedValueOnce({ rows: [mockVenta] });

            const result = await createVenta(1, 100);

            expect(result).toEqual(mockVenta);
            expect(pool.query).toHaveBeenCalledWith(
                'INSERT INTO "Ventas" (id_usuario, monto) VALUES ($1, $2) RETURNING *',
                [1, 100]
            );
        });

        it('debería manejar errores al crear una venta', async () => {
            pool.query.mockRejectedValueOnce(new Error('Error de base de datos'));

            await expect(createVenta(1, 100)).rejects.toThrow('Error de base de datos');
        });
    });

    describe('obtenerVentas', () => {
        it('debería obtener todas las ventas', async () => {
            const mockVentas = [{ id: 1, id_usuario: 1, monto: 100 }];
            pool.query.mockResolvedValueOnce({ rows: mockVentas });

            const result = await obtenerVentas();

            expect(result).toEqual(mockVentas);
            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM "Ventas"');
        });

        it('debería manejar errores al obtener todas las ventas', async () => {
            pool.query.mockRejectedValueOnce(new Error('Error de base de datos'));

            await expect(obtenerVentas()).rejects.toThrow('Error de base de datos');
        });
    });

    describe('obtenerVentaPorId', () => {
        it('debería obtener una venta por ID', async () => {
            const mockVenta = { id: 1, id_usuario: 1, monto: 100 };
            pool.query.mockResolvedValueOnce({ rows: [mockVenta] });

            const result = await obtenerVentaPorId(1);

            expect(result).toEqual(mockVenta);
            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM "Ventas" WHERE id = $1', [1]);
        });

        it('debería manejar errores al obtener una venta por ID', async () => {
            pool.query.mockRejectedValueOnce(new Error('Error de base de datos'));

            await expect(obtenerVentaPorId(1)).rejects.toThrow('Error de base de datos');
        });
    });

    describe('actualizarVenta', () => {
        it('debería actualizar una venta', async () => {
            const mockVenta = { id: 1, id_usuario: 1, monto: 150 };
            pool.query.mockResolvedValueOnce({ rows: [mockVenta] });

            const result = await actualizarVenta(1, 1, 150);

            expect(result).toEqual(mockVenta);
            expect(pool.query).toHaveBeenCalledWith(
                'UPDATE "Ventas" SET id_usuario = $1, monto = $2 WHERE id = $3 RETURNING *',
                [1, 150, 1]
            );
        });

        it('debería manejar errores al actualizar una venta', async () => {
            pool.query.mockRejectedValueOnce(new Error('Error de base de datos'));

            await expect(actualizarVenta(1, 1, 150)).rejects.toThrow('Error de base de datos');
        });
    });

    describe('eliminarVenta', () => {
        it('debería eliminar una venta', async () => {
            pool.query.mockResolvedValueOnce();

            await eliminarVenta(1);

            expect(pool.query).toHaveBeenCalledWith('DELETE FROM "Ventas" WHERE id = $1', [1]);
        });

        it('debería manejar errores al eliminar una venta', async () => {
            pool.query.mockRejectedValueOnce(new Error('Error de base de datos'));

            await expect(eliminarVenta(1)).rejects.toThrow('Error de base de datos');
        });
    });
});
