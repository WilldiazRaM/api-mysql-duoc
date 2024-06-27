const Coupon = require('../models/couponModel');

exports.createCoupon = async (req, res) => {
    try {
        const newCoupon = await Coupon.createCoupon(req.body);
        res.status(201).json({ message: 'Cupón creado correctamente', coupon: newCoupon });
    } catch (err) {
        console.error("Error creating coupon:", err.message);
        res.status(400).json({ error: err.message });
    }
};

exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.getAllCoupons();
        res.json(coupons);
    } catch (err) {
        console.error("Error fetching coupons:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.getCouponById(req.params.id);
        if (!coupon) {
            return res.status(404).json({ error: "Cupón no encontrado" });
        }
        res.json(coupon);
    } catch (err) {
        console.error("Error fetching coupon:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.updateCoupon = async (req, res) => {
    try {
        const updatedCoupon = await Coupon.updateCoupon(req.params.id, req.body);
        if (!updatedCoupon) {
            return res.status(404).json({ error: "Cupón no encontrado" });
        }
        res.json({ message: 'Cupón actualizado correctamente', coupon: updatedCoupon });
    } catch (err) {
        console.error("Error updating coupon:", err.message);
        res.status(400).json({ error: err.message });
    }
};

exports.deleteCoupon = async (req, res) => {
    try {
        const deletedCoupon = await Coupon.deleteCoupon(req.params.id);
        if (!deletedCoupon) {
            return res.status(404).json({ error: "Cupón no encontrado" });
        }
        res.status(200).json({ message: 'Cupón eliminado correctamente' });
    } catch (err) {
        console.error("Error deleting coupon:", err.message);
        res.status(500).json({ error: err.message });
    }
};
