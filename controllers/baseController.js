class BaseController {
    constructor(model) {
        this.model = model;
    }

    async getAll(req, res) {
        try {
            const items = await this.model.getAllUsers();
            res.json(items);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const item = await this.model.findUserById(req.params.id);
            if (item) {
                res.json(item);
            } else {
                res.status(404).json({ error: 'Item not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        const { nombre, email, password, role } = req.body;
        try {
            const hashedPassword = await this.model.hashPassword(password);
            await this.model.createUser(nombre, email, hashedPassword, role);
            res.status(201).json({ message: 'Usuario creado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        const { nombre, email, role } = req.body;
        try {
            const item = await this.model.findUserById(req.params.id);
            if (item) {
                await this.model.updateUser(req.params.id, nombre, email, role);
                res.json({ message: 'Usuario actualizado exitosamente' });
            } else {
                res.status(404).json({ error: 'Item not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const item = await this.model.findUserById(req.params.id);
            if (item) {
                await this.model.deleteUser(req.params.id);
                res.json({ message: 'Usuario eliminado exitosamente' });
            } else {
                res.status(404).json({ error: 'Item not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = BaseController;
