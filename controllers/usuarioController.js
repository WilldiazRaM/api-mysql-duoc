const BaseController = require('./baseController');
const Usuarios = require('../models/usuarioModel');

class UsuarioController extends BaseController {
    constructor() {
        super(Usuarios);
    }
}

module.exports = new UsuarioController();
