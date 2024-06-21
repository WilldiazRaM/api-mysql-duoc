const pool = require('../database');

const categoriasId = {
    'Herramientas Manuales': 1,
    'Herramientas Eléctricas': 2,
    'Materiales de Construcción': 3,
    'Acabados': 4,
    'Equipos de Seguridad': 5,
    'Tornillos y Anclajes': 6,
    'Fijaciones y Adhesivos': 7,
    'Equipos de Medición': 8
};

async function createProducto(nombre, precio, descripcion, stock, categoria_nombre) {
    const categoria_id = categoriasId[categoria_nombre];
    if (!categoria_id) {
        throw new Error('La categoría especificada no existe');
    }

    const query = 'INSERT INTO "Productos" (nombre, precio, descripcion, stock, categoria_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [nombre, precio, descripcion, stock, categoria_id];
    
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error en createProducto:", error);
        throw error;
    }
}

async function obtenerProductos() {
    const query = 'SELECT * FROM "Productos"';
    
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error("Error al obtener productos:", error);
        throw error;
    }
}

async function obtenerProductoPorId(id) {
    const query = 'SELECT * FROM "Productos" WHERE id = $1';
    const values = [id];
    
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error al obtener producto por ID:", error);
        throw error;
    }
}

async function actualizarProducto(id, nombre, precio, descripcion, stock, categoria_nombre) {
    const categoria_id = categoriasId[categoria_nombre];
    if (!categoria_id) {
        throw new Error('La categoría especificada no existe');
    }

    const query = 'UPDATE "Productos" SET nombre = $1, precio = $2, descripcion = $3, stock = $4, categoria_id = $5 WHERE id = $6 RETURNING *';
    const values = [nombre, precio, descripcion, stock, categoria_id, id];
    
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        throw error;
    }
}

async function eliminarProducto(id) {
    const query = 'DELETE FROM "Productos" WHERE id = $1';
    const values = [id];
    
    try {
        await pool.query(query, values);
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        throw error;
    }
}

module.exports = {
    createProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto
};
