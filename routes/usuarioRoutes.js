const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { checkHeaders, sqlInjectionFilter } = require('../middleware/sqlInjectionFilter');

// Aplicar el middleware de filtrado de inyecciones SQL
router.use(sqlInjectionFilter);

// Rutas CRUD para Usuarios
router.get('/', usuarioController.getAll.bind(usuarioController));
router.get('/:id', usuarioController.getById.bind(usuarioController));
router.put('/:id', checkHeaders(['x-nombre', 'x-email', 'x-role']), usuarioController.update.bind(usuarioController));
router.delete('/:id', usuarioController.delete.bind(usuarioController));

module.exports = router;
