const { createCoupon, getAllCoupons, getCouponById, updateCoupon, deleteCoupon } = require('../controllers/couponController');
const Coupon = require('../models/couponModel');
const { validarCamposCupon } = require('../utils/validation');

jest.mock('../models/couponModel');

describe('couponController', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: '1' }, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('validarCamposCupon', () => {
    it('debería devolver un error si faltan campos', () => {
      expect(validarCamposCupon({})).toBe('Todos los campos son obligatorios');
    });

    it('debería devolver null si todos los campos están presentes', () => {
      const couponData = { codigo: 'DESCUENTO10', descuento: 10, fecha_expiracion: '2024-12-31', usos_restantes: 5 };
      expect(validarCamposCupon(couponData)).toBeNull();
    });
  });

  describe('createCoupon', () => {
    it('debería devolver un error si faltan campos', async () => {
      await createCoupon(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Todos los campos son obligatorios' });
    });

    it('debería crear un cupón correctamente si todos los campos son válidos', async () => {
      const newCoupon = { id: 1, ...req.body };
      Coupon.createCoupon.mockResolvedValue(newCoupon);

      req.body = { codigo: 'DESC10', descuento: 10, fecha_expiracion: '2024-12-31', usos_restantes: 5 };

      await createCoupon(req, res);
      expect(Coupon.createCoupon).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cupón creado correctamente', coupon: newCoupon });
    });

    it('debería devolver un error si ocurre un problema en la base de datos', async () => {
      Coupon.createCoupon.mockRejectedValue(new Error('Error en la base de datos'));

      await createCoupon(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error en la base de datos' });
    });
  });
});
