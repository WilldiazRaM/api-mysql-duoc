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
const { checkHeaders, sqlInjectionFilter } = require('../middleware/sqlInjectionFilter');

//router.use(sqlInjectionFilter);

router.post('/iniciar', iniciarTransaccion);
router.post('/confirmar', confirmarTransaccion);

router.get('/', getAllPagos);
router.get('/:id', getPagoById);
router.post('/', createPago);
router.put('/:id', updatePago);
router.delete('/:id', deletePago);

module.exports = router;
