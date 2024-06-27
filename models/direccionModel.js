const pool = require('../database');

async function createDireccion(direccion) {
    const { id_usuario, direccion, ciudad, codigo_postal } = direccion;

    // Validaciones de input
    if (!id_usuario || !direccion || !ciudad || !codigo_postal) {
        throw new Error('Todos los campos son obligatorios');
    }

    if (direccion.length > 255) {
        throw new Error('La dirección no puede tener más de 255 caracteres');
    }

    if (ciudad.length > 100) {
        throw new Error('La ciudad no puede tener más de 100 caracteres');
    }

    if (codigo_postal.length > 20) {
        throw new Error('El código postal no puede tener más de 20 caracteres');
    }

    // Verificar si el usuario existe
    const userCheckQuery = 'SELECT * FROM "Usuarios" WHERE id = $1';
    const userCheckResult = await pool.query(userCheckQuery, [id_usuario]);
    if (userCheckResult.rowCount === 0) {
        throw new Error('El usuario no existe');
    }

    const query = 'INSERT INTO "Direcciones" (id_usuario, direccion, ciudad, codigo_postal) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [id_usuario, direccion, ciudad, codigo_postal];
    const result = await pool.query(query, values);
    return result.rows[0];
}

async function getAllDirecciones() {
    const query = 'SELECT * FROM "Direcciones"';
    const result = await pool.query(query);
    return result.rows;
}

async function getDireccionById(id) {
    const query = 'SELECT * FROM "Direcciones" WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

async function updateDireccion(id, direccion) {
    const { id_usuario, direccion, ciudad, codigo_postal } = direccion;

    // Validaciones de input
    if (!id_usuario || !direccion || !ciudad || !codigo_postal) {
        throw new Error('Todos los campos son obligatorios');
    }

    if (direccion.length > 255) {
        throw new Error('La dirección no puede tener más de 255 caracteres');
    }

    if (ciudad.length > 100) {
        throw new Error('La ciudad no puede tener más de 100 caracteres');
    }

    if (codigo_postal.length > 20) {
        throw new Error('El código postal no puede tener más de 20 caracteres');
    }

    // Verificar si el usuario existe
    const userCheckQuery = 'SELECT * FROM "Usuarios" WHERE id = $1';
    const userCheckResult = await pool.query(userCheckQuery, [id_usuario]);
    if (userCheckResult.rowCount === 0) {
        throw new Error('El usuario no existe');
    }

    const query = 'UPDATE "Direcciones" SET id_usuario = $1, direccion = $2, ciudad = $3, codigo_postal = $4 WHERE id = $5 RETURNING *';
    const values = [id_usuario, direccion, ciudad, codigo_postal, id];
    const result = await pool.query(query, values);
    return result.rows[0];
}

async function deleteDireccion(id) {
    const query = 'DELETE FROM "Direcciones" WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

module.exports = {
    createDireccion,
    getAllDirecciones,
    getDireccionById,
    updateDireccion,
    deleteDireccion
};
