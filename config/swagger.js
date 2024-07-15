const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Documentación de la API de tu proyecto',
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
