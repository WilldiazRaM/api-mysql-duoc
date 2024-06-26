const BaseController = require('./baseController');
const Usuarios = require('../models/userModel');
const { register } = require('./authController');

class UsuarioController extends BaseController {
    constructor() {
        super(Usuarios);
    }

    // Reutilizar la función de registro para la creación de usuarios
    async create(req, res) {
        return register(req, res);
    }
}

module.exports = new UsuarioController();
