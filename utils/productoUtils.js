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
    return new Promise((resolve, reject) => {
        // Obtener el id de la categoría correspondiente al nombre de la categoría
        const categoria_id = categoriasId[categoria_nombre];
        if (!categoria_id) {
            // Si la categoría no existe en el diccionario, rechazar la promesa con un error
            const error = new Error('La categoría especificada no existe');
            console.error("Error en createProducto:", error);
            return reject(error);
        }

        // Realizar la inserción del producto con el id de la categoría obtenido
        const query = 'INSERT INTO Productos (nombre, precio, descripcion, stock, categoria_id) VALUES (?, ?, ?, ?, ?)';
        pool.query(query, [nombre, precio, descripcion, stock, categoria_id], (error, result) => {
            if (error) {
                console.error("Error en createProducto:", error);
                return reject(error); // Rechazar la promesa con el error
            }
            const newProductId = result.insertId;
            // Resolver con los datos del producto registrado
            resolve({ id: newProductId, nombre, precio, descripcion, stock, categoria_id });
        });
    });
}

// Función para obtener todos los productos
async function obtenerProductos() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Productos;', (error, result) => {
            if (error) {
                console.error("Error al obtener productos:", error);
                return reject(error);
            }
            const productos = result.rows; // Accede a los resultados reales
            resolve(productos);
        });
    });
}


// Función para obtener un producto por su ID
async function obtenerProductoPorId(id) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Productos WHERE id = ?', [id], (error, result) => {
            if (error) {
                console.error("Error al obtener producto por ID:", error);
                return reject(error);
            }
            const producto = result.rows[0]; // Accede al primer resultado (si existe)
            resolve(producto);
        });
    });
}


module.exports = {
    createProducto, obtenerProductos, obtenerProductoPorId
};