class BaseController {
    constructor(model) {
        this.model = model;
    }

    async getAll(req, res) {
        try {
            const items = await this.model.findAll();
            res.json(items);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const item = await this.model.findByPk(req.params.id);
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
        try {
            const item = await this.model.create(req.body);
            res.status(201).json(item);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const item = await this.model.findByPk(req.params.id);
            if (item) {
                await item.update(req.body);
                res.json(item);
            } else {
                res.status(404).json({ error: 'Item not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const item = await this.model.findByPk(req.params.id);
            if (item) {
                await item.destroy();
                res.json({ message: 'Item deleted' });
            } else {
                res.status(404).json({ error: 'Item not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = BaseController;
