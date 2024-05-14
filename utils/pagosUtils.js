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

// Función para obtener un pago por su ID
async function getPagoById(id) {
    try {
        // Consultar la base de datos para obtener el pago con el ID especificado
        const pago = await pool.query('SELECT * FROM Ventas WHERE id = ?', [id]);
        
        // Verificar si se encontró algún pago con el ID proporcionado
        if (pago.length === 0) {
            throw new Error("Pago no encontrado");
        }
        
        // Devolver el pago encontrado
        return pago[0];
    } catch (error) {
        // Si hay algún error, rechazar la promesa con el mensaje de error
        throw new Error("Ocurrió un error al obtener el pago: " + error.message);
    }
}


module.exports = { generateBuyOrder, generateSessionId, obtenerPagos, getPagoById};