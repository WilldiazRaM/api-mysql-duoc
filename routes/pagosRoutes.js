const express = require('express');
const router = express.Router();
const { iniciarTransaccion, confirmarTransaccion } = require('../controllers/pagoController');
const { checkHeaders, sqlInjectionFilter } = require('../middleware/sqlInjectionFilter');

router.use(sqlInjectionFilter);

router.post('/iniciar', iniciarTransaccion);
router.post('/confirmar', confirmarTransaccion);

module.exports = router;
