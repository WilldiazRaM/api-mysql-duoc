// Función para generar un número de orden de compra único
function generateBuyOrder() {
    return Math.floor(Math.random() * 1000000); // Ejemplo: generación aleatoria
}

// Función para generar un ID de sesión único
function generateSessionId() {
    const randomSession = Math.floor(Math.random() * 10000000000); // Generar número aleatorio
    const formattedSession = `sesion${randomSession}`; // Concatenar con el texto "sesion"
    return formattedSession;
}

module.exports = { generateBuyOrder, generateSessionId };
