const BaseController = require('./baseController');
const Usuarios = require('../models/userModel');

class UsuarioController extends BaseController {
    constructor() {
        super(Usuarios);
    }

    async create(req, res) {
        const { nombre, email, password, role } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await this.model.createUser(nombre, email, hashedPassword, role);
            res.status(201).json({ message: 'Usuario creado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const userId = req.params.id;
            const user = await this.model.findUserById(userId);
            if (user) {
                await this.model.deleteUser(userId);
                res.json({ message: 'Usuario eliminado exitosamente' });
            } else {
                res.status(404).json({ error: 'Item not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new UsuarioController();
