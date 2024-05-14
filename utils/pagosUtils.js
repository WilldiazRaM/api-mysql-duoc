const pool = require('../database');


// Función para generar un número de orden de compra único
function generateBuyOrder() {
    // Aquí puedes implementar la lógica para generar un número de orden único
    return Math.floor(Math.random() * 1000000); // Ejemplo: generación aleatoria
}



// Función para generar un ID de sesión único
function generateSessionId() {
    const randomSession = Math.floor(Math.random() * 10000000000); // Generar número aleatorio
    const formattedSession = `sesion${randomSession}`; // Concatenar con el texto "sesion"
    return formattedSession;
}


function obtenerPagos() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM Ventas', (error, pagos) => {
            if (error) {
                console.error("Error al obtener los pagos:", error);
                return reject(error);
            }
            const pagosData = pagos.map(pago => ({
                id: pago.id,
                id_usuario: pago.id_usuario,
                monto: pago.monto,
                // Agrega más campos según sea necesario
            }));
            resolve(pagosData);
        });
    });
}


module.exports = { generateBuyOrder, generateSessionId, obtenerPagos};