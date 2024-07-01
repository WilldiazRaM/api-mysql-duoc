const { createDetalleVenta } = require('../models/detalleVentaModel');
const pool = require('../database');

jest.mock('../database', () => ({
  query: jest.fn(),
}));

describe('detalleVentaModel', () => {
  describe('createDetalleVenta', () => {
    it('debería lanzar un error si faltan campos', async () => {
      await expect(createDetalleVenta(null, 1, 1, 10, 100))
        .rejects
        .toThrow('Todos los campos son obligatorios');
    });

    it('debería crear un detalle de venta correctamente si todos los campos son válidos', async () => {
      const detalleVentaData = { id_venta: 1, id_producto: 1, id_usuario: 1, cantidad: 10, precio_unitario: 100 };
      const newDetalleVenta = { id: 1, ...detalleVentaData };
      pool.query.mockResolvedValueOnce({ rows: [newDetalleVenta] });

      const result = await createDetalleVenta(1, 1, 1, 10, 100);
      expect(result).toEqual(newDetalleVenta);
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO "DetalleVenta" (id_venta, id_producto, id_usuario, cantidad, precio_unitario) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [1, 1, 1, 10, 100]
      );
    });

    it('debería lanzar un error si ocurre un problema en la base de datos', async () => {
      pool.query.mockRejectedValueOnce(new Error('Error en la base de datos'));

      await expect(createDetalleVenta(1, 1, 1, 10, 100))
        .rejects
        .toThrow('Error en la base de datos');
    });
  });
});
