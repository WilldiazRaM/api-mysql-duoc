const pool = require('../database');
const DetalleVenta = require('../models/detalleVentaModel');

jest.mock('../database'); // Mockear el pool de la base de datos

describe('DetalleVenta Model', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpiar mocks antes de cada prueba
    });

    describe('createDetalleVenta', () => {
        it('should create a sale detail successfully', async () => {
            const mockResult = { rows: [{ id: 1, id_venta: 1, id_producto: 1, id_usuario: 1, cantidad: 2, precio_unitario: 100 }] };
            pool.query.mockResolvedValue(mockResult); // Simular respuesta del query

            const detalle = await DetalleVenta.createDetalleVenta(1, 1, 1, 2, 100);

            expect(detalle).toEqual(mockResult.rows[0]);
            expect(pool.query).toHaveBeenCalledWith(
                'INSERT INTO "DetalleVenta" (id_venta, id_producto, id_usuario, cantidad, precio_unitario) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [1, 1, 1, 2, 100]
            );
        });

        it('should throw an error if the query fails', async () => {
            pool.query.mockRejectedValue(new Error('Database error'));

            await expect(DetalleVenta.createDetalleVenta(1, 1, 1, 2, 100)).rejects.toThrow('Database error');
        });
    });

    describe('obtenerDetallesVenta', () => {
        it('should fetch all sale details successfully', async () => {
            const mockResult = { rows: [{ id: 1, id_venta: 1, id_producto: 1 }] };
            pool.query.mockResolvedValue(mockResult);

            const detalles = await DetalleVenta.obtenerDetallesVenta();

            expect(detalles).toEqual(mockResult.rows);
            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM "DetalleVenta"');
        });

        it('should throw an error if the query fails', async () => {
            pool.query.mockRejectedValue(new Error('Database error'));

            await expect(DetalleVenta.obtenerDetallesVenta()).rejects.toThrow('Database error');
        });
    });

    describe('obtenerDetalleVentaPorId', () => {
        it('should fetch sale detail by ID successfully', async () => {
            const mockResult = { rows: [{ id: 1, id_venta: 1, id_producto: 1 }] };
            pool.query.mockResolvedValue(mockResult);

            const detalle = await DetalleVenta.obtenerDetalleVentaPorId(1);

            expect(detalle).toEqual(mockResult.rows[0]);
            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM "DetalleVenta" WHERE id = $1', [1]);
        });

        it('should return undefined if the sale detail does not exist', async () => {
            pool.query.mockResolvedValue({ rows: [] });

            const detalle = await DetalleVenta.obtenerDetalleVentaPorId(999);

            expect(detalle).toBeUndefined();
        });

        it('should throw an error if the query fails', async () => {
            pool.query.mockRejectedValue(new Error('Database error'));

            await expect(DetalleVenta.obtenerDetalleVentaPorId(1)).rejects.toThrow('Database error');
        });
    });

    describe('actualizarDetalleVenta', () => {
        it('should update a sale detail successfully', async () => {
            const mockResult = { rows: [{ id: 1, id_venta: 1, id_producto: 1 }] };
            pool.query.mockResolvedValue(mockResult);

            const detalle = await DetalleVenta.actualizarDetalleVenta(1, 1, 1, 1, 2, 100);

            expect(detalle).toEqual(mockResult.rows[0]);
            expect(pool.query).toHaveBeenCalledWith(
                'UPDATE "DetalleVenta" SET id_venta = $1, id_producto = $2, id_usuario = $3, cantidad = $4, precio_unitario = $5 WHERE id = $6 RETURNING *',
                [1, 1, 1, 2, 100, 1]
            );
        });

        it('should throw an error if the query fails', async () => {
            pool.query.mockRejectedValue(new Error('Database error'));

            await expect(DetalleVenta.actualizarDetalleVenta(1, 1, 1, 1, 2, 100)).rejects.toThrow('Database error');
        });
    });

    describe('eliminarDetalleVenta', () => {
        it('should delete a sale detail successfully', async () => {
            pool.query.mockResolvedValue(); // Simular respuesta vacía

            await DetalleVenta.eliminarDetalleVenta(1);

            expect(pool.query).toHaveBeenCalledWith('DELETE FROM "DetalleVenta" WHERE id = $1', [1]);
        });

        it('should throw an error if the query fails', async () => {
            pool.query.mockRejectedValue(new Error('Database error'));

            await expect(DetalleVenta.eliminarDetalleVenta(1)).rejects.toThrow('Database error');
        });
    });
});
