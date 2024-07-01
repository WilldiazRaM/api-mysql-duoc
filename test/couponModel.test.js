const { savePayment } = require('../models/pagoModel');
const pool = require('../database');

jest.mock('../database', () => ({
  query: jest.fn(),
}));

describe('pagoModel', () => {
  describe('savePayment', () => {
    const paymentData = {
      id_venta: 1,
      monto: 1000,
      metodo_pago: 'tarjeta',
      estado_pago: 'pendiente',
      token: 'token123'
    };

    it('debería guardar un pago correctamente', async () => {
      const newPayment = { id: 1, ...paymentData };
      pool.query.mockResolvedValueOnce({ rows: [newPayment] });

      const result = await savePayment(paymentData);
      expect(result).toEqual(newPayment);
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO "Pagos" (id_venta, monto, metodo_pago, estado_pago, token) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
        [1, 1000, 'tarjeta', 'pendiente', 'token123']
      );
    });

    it('debería lanzar un error si ocurre un problema en la base de datos', async () => {
      const errorMessage = 'Error en la base de datos';
      pool.query.mockRejectedValueOnce(new Error(errorMessage));

      await expect(savePayment(paymentData))
        .rejects
        .toThrow(errorMessage);
    });
  });
});
