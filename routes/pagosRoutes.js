const express = require('express');
const router = express.Router();
const { 
    iniciarTransaccion, 
    confirmarTransaccion, 
    getAllPagos, 
    getPagoById, 
    createPago, 
    updatePago, 
    deletePago 
} = require('../controllers/pagoController');

router.post('/iniciar', iniciarTransaccion);
router.post('/confirmar', confirmarTransaccion);



router.post('/', (req, res, next) => {
    console.log('Request Body in Route:', req.body);
    next();
}, createPago);
router.get('/', getAllPagos);
router.get('/:id', getPagoById);
router.put('/:id', updatePago);
router.delete('/:id', deletePago);

module.exports = router;
