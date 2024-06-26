const BaseController = require('./baseController');
const Usuarios = require('../models/userModel');

class UsuarioController extends BaseController {
    constructor() {
        super(Usuarios);
    }
}

module.exports = new UsuarioController();
