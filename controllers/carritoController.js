const pool = require('../database');

const addProductToCart = async (req, res) => {
    const { id_producto, cantidad, id_usuario } = req.body;

    try {
        // Verificar si el producto existe y hay suficiente cantidad en stock
        const producto = await pool.query('SELECT * FROM "Productos" WHERE id = $1', [id_producto]);

        if (producto.rowCount === 0 || producto.rows[0].stock < cantidad) {
            return res.status(400).json({ error: "Producto no disponible o cantidad insuficiente en stock" });
        }

        // Insertar el producto en el carrito
        await pool.query('INSERT INTO "DetalleVenta" (id_producto, cantidad, id_usuario) VALUES ($1, $2, $3)', [id_producto, cantidad, id_usuario]);

        res.status(201).json({ message: "Producto agregado al carrito correctamente" });
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).json({ error: "Ocurrió un error al agregar el producto al carrito" });
    }
};

const getUserCart = async (req, res) => {
    const { id_usuario } = req.params;

    try {
        const carrito = await pool.query('SELECT * FROM "DetalleVenta" WHERE id_usuario = $1', [id_usuario]);
        res.status(200).json(carrito.rows);
    } catch (error) {
        console.error("Error al obtener contenido del carrito:", error);
        res.status(500).json({ error: "Ocurrió un error al obtener el contenido del carrito" });
    }
};

const updateCartProduct = async (req, res) => {
    const { id_detalle } = req.params;
    const { cantidad } = req.body;

    try {
        await pool.query('UPDATE "DetalleVenta" SET cantidad = $1 WHERE id = $2', [cantidad, id_detalle]);
        res.status(200).json({ message: "Cantidad de producto en el carrito actualizada correctamente" });
    } catch (error) {
        console.error("Error al actualizar cantidad de producto en el carrito:", error);
        res.status(500).json({ error: "Ocurrió un error al actualizar la cantidad de producto en el carrito" });
    }
};

const deleteCartProduct = async (req, res) => {
    const { id_detalle } = req.params;

    try {
        await pool.query('DELETE FROM "DetalleVenta" WHERE id = $1', [id_detalle]);
        res.status(200).json({ message: "Producto eliminado del carrito correctamente" });
    } catch (error) {
        console.error("Error al eliminar producto del carrito:", error);
        res.status(500).json({ error: "Ocurrió un error al eliminar el producto del carrito" });
    }
};

module.exports = {
    addProductToCart,
    getUserCart,
    updateCartProduct,
    deleteCartProduct
};
