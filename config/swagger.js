const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Documentación Api-FerreMax-DuocUC',
            version: '1.0.0',
            description: 'Sistema de mejora para ferreterias ferreMax, en pocas palabras implementacion de e-commerce integrado con pagos transbank',
        },
        servers: [
            {
                url: 'https://api-mysql-duoc.onrender.com', // URL base API
            },
        ],
    },
    apis: [
        path.join(__dirname, '../routes/*.js'), // Ruta archivos de rutas
        path.join(__dirname, '../models/*.js'), // Ruta archivos de modelos
    ],
};

const specs = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    specs,
};
