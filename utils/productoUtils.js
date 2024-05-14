const pool = require('../database');

async function createProducto(nombre, precio, descripcion, stock, categoria_nombre) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO Productos (nombre, precio, descripcion, stock, categoria_nombre) VALUES (?, ?, ?, ?, ?)';
        pool.query(query, [nombre, precio, descripcion, stock, categoria_nombre], (error, result) => {
            if (error) {
                console.error("Error en createProducto:", error);
                return reject(error); // Rechazar la promesa con el error
            }
            const newProductId = result.insertId;
            // Resolver con los datos del producto registrado
            resolve({ id: newProductId, nombre, precio, descripcion, stock, categoria_nombre });
        });
    });
}

module.exports = {
    createProducto
};