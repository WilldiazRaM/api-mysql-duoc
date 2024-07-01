const { crearDetalleVenta, obtenerTodosLosDetallesVenta, obtenerDetalleVenta, actualizarDetalleVentaPorId, eliminarDetalleVentaPorId } = require('../controllers/detalleVentaController');
const DetalleVenta = require('../models/detalleVentaModel');

jest.mock('../models/detalleVentaModel');

describe('detalleVentaController', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: '1' }, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('crearDetalleVenta', () => {
    it('debería devolver un error si faltan campos', async () => {
      await crearDetalleVenta(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Todos los campos son obligatorios' });
    });

    it('debería crear un detalle de venta correctamente si todos los campos son válidos', async () => {
      const newDetalleVenta = { id: 1, ...req.body };
      DetalleVenta.createDetalleVenta.mockResolvedValue(newDetalleVenta);

      req.body = { id_venta: 1, id_producto: 1, id_usuario: 1, cantidad: 10, precio_unitario: 100 };

      await crearDetalleVenta(req, res);
      expect(DetalleVenta.createDetalleVenta).toHaveBeenCalledWith(req.body.id_venta, req.body.id_producto, req.body.id_usuario, req.body.cantidad, req.body.precio_unitario);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newDetalleVenta);
    });

    it('debería devolver un error si ocurre un problema en la base de datos', async () => {
      DetalleVenta.createDetalleVenta.mockRejectedValue(new Error('Error en la base de datos'));

      await crearDetalleVenta(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error en la base de datos' });
    });
  });
});
