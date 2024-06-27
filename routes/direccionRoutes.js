const express = require('express');
const router = express.Router();
const direccionController = require('../controllers/direccionController');

router.post('/', direccionController.createDireccion);
router.get('/', direccionController.getAllDirecciones);
router.get('/:id', direccionController.getDireccionById);
router.put('/:id', direccionController.updateDireccion);
router.delete('/:id', direccionController.deleteDireccion);

module.exports = router;
